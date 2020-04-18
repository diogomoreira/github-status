import axios from "axios";
import cheerio from "cheerio";

const url = 'https://www.githubstatus.com';

class Scraper {

    constructor() {
        this.statuses = [];
        this.lastUpdateTimeStamp = '';
        this.statusItems = document.getElementById('status-items');
        this.fetchData();
    }

    async fetchData() {
        this.statuses = [];
        const { data } = await axios.get(url);
        this.lastUpdateTimeStamp = new Date().toLocaleString();
        const $ = cheerio.load(data);
        let statuses = $('div[data-component-status]').each(
            (i, item) => {
                if (item.attribs.class.includes('showcased')) {
                    this.statuses.push({
                        item: $('span.name', item).text().replace(/(\r\n|\n|\r)/gm, "").trim(),
                        status: $('span.component-status', item).text().replace(/(\r\n|\n|\r)/gm, "").trim()
                    });
                }
            }
        );
        this.render();
    }

    render() {
        console.log(this.statuses.length);
        this.statusItems.innerHTML = '';
        this.statuses.forEach(statusItem => {
            let title = statusItem.item;
            let status = statusItem.status;

            let statusDiv = document.createElement('div');
            statusDiv.classList = 'nes-container is-rounded container';
            this.statusItems.appendChild(statusDiv);

            let statusTitleH2 = document.createElement('h2');
            statusTitleH2.appendChild(document.createTextNode(title));
            statusDiv.appendChild(statusTitleH2);

            let detailsDiv = document.createElement('div');
            detailsDiv.classList = 'container-status';
            statusDiv.appendChild(detailsDiv);

            let timeComponent = document.createElement('time');
            timeComponent.appendChild(document.createTextNode(`Last update: ${this.lastUpdateTimeStamp}`));
            
            let statusComponent = document.createElement('div');
            let colorDisplay = status === "Operational" ? 'operational' : 'unoperational';
            statusComponent.classList = `status-info ${colorDisplay}`;
            statusComponent.appendChild(document.createTextNode(status));

            detailsDiv.appendChild(timeComponent);
            detailsDiv.appendChild(statusComponent);
        });
    }

}

const githubScraper = new Scraper();
document.getElementById('bt-refresh').addEventListener("click", () => githubScraper.fetchData());