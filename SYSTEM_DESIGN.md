# System Design Document: Log Ingestor and Query Interface

## 1. Introduction

### 1.1 Purpose of the Document
The purpose of this document is to provide a comprehensive overview of the design and architecture of the Log Ingestor and Query Interface systems. These systems are intended to efficiently handle vast volumes of log data, providing a seamless mechanism for log ingestion and a user-friendly interface for querying log data.

### 1.2 Scope of the Document
The system encompasses the development of two main components: the log ingestor responsible for receiving and storing log data over HTTP, and the query interface that allows users to perform searches and filter logs.

## 2. System Overview
### 2.1 System Architecture
![System Architecture](./assets/system-architecture.png)

The system follows a microservices architecture, comprising the Log Ingestor and the Query Interface. These components interact through well-defined APIs.

### 2.2 System Components
- **Log Ingestor**: The Log Ingestor is responsible for receiving log data over HTTP and storing it in a database.It is also resposible for quering the data based on the filters provided by Query interface. 
- **Query Interface**: The Query Interface is responsible for providing a user-friendly interface for querying log data. It is implemented as a web application that allows users to filter logs. And displays the results in a table.
- **Database**: Elasticsearch is used as the database for storing log data. It is a distributed, RESTful search and analytics engine capable of storing and indexing large volumes of data. It used invert index to store the data which makes it very fast for searching and filtering data.


### 2.3 Technologies Used
- **Log Ingestor**: Express.js, Node.js, ElasticSearch client
- **Query Interface**: React.js, Tailwind CSS, Shadcn component library
- **Database**: ElasticSearch

## 3.1 Log Ingestor
### 3.1.1 Overview
The Log ingestor contains RESTful API endpoints that allow users to send and query log data from the Elastic Search database

### 3.1.2 API documentation
Postman Collection is provided in a JSON file at the root of the project.

### 3.1.3 API Endpoints

- `POST /api/ingest`: This endpoint is used to ingest log data into the database. It accepts a JSON object containing the log data and stores it in the database.
  - **Request Body** 
    ```json
    {
        "level": "string",
        "message": "string",
        "resourceId": "string",
        "timestamp": "YYYY-MM-DDTHH:MM:SSZ",
        "traceId": "string",
        "spanId": "string",
        "commit": "string",
        "metadata": {
            "parentResourceId": "string"
        }
    }
    ```
- `POST /api/ingest/bulk`: This endpoint is used to ingest multiple log data into the database. It accepts a JSON array containing the log data and stores it in the database.
  - **Request Body** 
    ```json
    [
        {
            "level": "string",
            "message": "string",
            "resourceId": "string",
            "timestamp": "YYYY-MM-DDTHH:MM:SSZ",
            "traceId": "string",
            "spanId": "string",
            "commit": "string",
            "metadata": {
                "parentResourceId": "string"
            }
        }
    ]
    ```
- `GET /api/logs`: This endpoint is used to get the most recent logs from the database with a limit of 100 logs.
- `POST /api/filter`: This endpoint is used to filter logs based on the filters provided by the user. It accepts a JSON object containing the filters and returns the filtered logs. All the filters in the request body are optional and can work with each other.
  - **Request Body** 
    ```json
    {
        "level": "string",
        "message": "string",
        "resourceId": "string",
        "timestamp": "YYYY-MM-DDTHH:MM:SSZ",
        "traceId": "string",
        "spanId": "string",
        "commit": "string",
        "parentResourceId": "string",
        "timeRange": {
            "timestampGte": "YYYY-MM-DDTHH:MM:SSZ",
            "timestampLte": "YYYY-MM-DDTHH:MM:SSZ"
        }
    }
    ```

### 3.1.4 Ingestion Process
1. Server starts listening on port 3000.
2. Server checks if index template, index life cycle policy and rename pipeline exists in the database. If not, it creates them.
3. Index Lifecycle Policy rotate the index and create a new write index each day. Previous indices are stored in cold storage with 1 shard and 1 replica.
4. Data is ingested using the `POST /api/ingest` or `POST /api/ingest/bulk` endpoint.
5. Log Data field `timestamp` is renamed to `@timestamp` using Elastic Search Ingest pipeline to be compatible with Elastic Search data streams.
6. Data is store in the database with index alias `log-data` to the latest index provided by data stream.

### 3.1.5 Querying Process
1. Server starts listening on port 3000.
2. Server checks if index template, index life cycle policy and rename pipeline exists in the database. If not, it creates them.
3. Data is queried using the `GET /api/logs` or `POST /api/filter` endpoint.
4. Data is queried from the database using the index alias `log-data` which points to the latest index provided by data stream.
5. Data is returned to the user.

### 3.1.6 Database Schema

```json
{
    "level": "keyword",
    "message": "text",
    "resourceId": "keyword",
    "@timestamp": "date",
    "traceId": "keyword",
    "spanId": "keyword",
    "commit": "keyword",
    "metadata": {
        "parentResourceId": "keyword"
    }

}
```

**Data Types**
- `keyword`: A single value that is not analyzed. For example, a zip code, a product ID, or a serial number.
- `text`: A field to index full-text values, such as the body of an email or the description of a product.
- `date`: A date value, such as 2015-01-01 or 2015/01/01 12:10:30. The date type includes time zone information in the serialized value, and converts the serialized value to Coordinated Universal Time (UTC) when indexing and querying.

### 3.1.7 Scalability
The Log Ingestor is designed to be horizontally scalable. It can be deployed on multiple servers and can be load balanced using a load balancer.

The Elastic Search nodes can be scaled horizontally to handle large volumes of data. We can also add more shards and replicas to the index to improve the performance of the database.

**Current Limitations**
- There is only `1` Log Ingestor server in the docker container. It can be scaled horizontally by adding more servers and load balancing them using a load balancer.
- There are `3` Elastic Search nodes in the docker container. It can be scaled horizontally by adding more nodes to the cluster.
- We are using `5` shards and `1` replica for the index data stream. It can be scaled by adding more shards and replicas to the index.

## 3.2 Query Interface
### 3.2.1 Overview
The Query Interface is a web application that allows users to filter logs and view the results in a table. It is implemented using React.js and Tailwind CSS.

### 3.2.2 Available Filters
- Exact match filters: `level`, `resourceId`, `traceId`, `spanId`, `commit`, `parentResourceId`, `timestamp`
- Time range filter: `timestampGte`, `timestampLte`
- Full text search filter: `message`

### 3.2.3 User Interface
![Query Interface](./assets/query-interface.png)


## 4. Deployment
### 4.1 Prerequisites
- Docker Compose
- Docker

### 4.2 Deployed Services
Docker Compose is used to deploy the system. It contains the following services:
- **Log Ingestor**: The Log Ingestor is deployed as a Node.js application in a docker container. It is exposed on port `3000`.
- **Query Interface**: The Query Interface is deployed as a React.js application in a docker container. 
- **Elastic Search**: Elastic Search is deployed as a docker container. It is exposed on port `9200`.
- **Kibana**: Kibana is deployed as a docker container. It is exposed on port `5601`. It is used to view the logs in the database. It is not used in the system.
