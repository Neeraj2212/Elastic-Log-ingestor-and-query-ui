
<!-- ABOUT THE PROJECT -->
## About The Project
This project aims to develop a robust Log Ingestor and Query Interface system capable of efficiently handling vast volumes of log data. The Log Ingestor is responsible for ingesting logs over HTTP on port 3000, while the Query Interface provides users with a simple interface for full-text search and specific field filters.

<!-- GETTING STARTED -->
## Getting Started
### Prerequisites
- Docker
- Docker Compose

### Running the project
1. Clone the repository `git clone <repo_url>`
2. To Run the project in development mode execute the command
    `docker compose -f docker-compose.yml -f docker-compose.dev.yml up` in the root directory of the project. It will start the following services:
    - Log Ingestor (Development mode at port 3000)
    - Query Interface (Development mode at port 5000)
    - Elasticsearch (Three Nodes)
    - Kibana dashboard (at port 5601 for visualizing logs `username: elastic, password: elastic_password`) 
    - NOTE:- Processes might take some time to start up. Please wait for a few minutes before using the services.
3. To Run the project in production mode execute the command
   `docker compose -f docker-compose.yml -f docker-compose.prod.yml up` in the root directory of the project. It will start the following services:
    - Log Ingestor (Production mode at port 3000)
    - Query Interface (Production mode at port 5000)
    - Elasticsearch (Three Nodes)
    - NOTE:- Processes might take some time to start up. Please wait for a few minutes before using the services.

### API Documentation
Check the postman collection for API documentation [here](https://documenter.getpostman.com/view/16239037/2s9Ye8faZF)

To run the postman collection, download the collection from [here](./postman_collection.json) and import it in postman.
<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

