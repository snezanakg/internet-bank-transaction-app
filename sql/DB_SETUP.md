# Database Setup & Seed Guide

Follow these instructions to set up the database and run the seed process from scratch.

## Prerequisites

- PostgreSQL installed and running.
- The project repository cloned to your local machine.

## How to Run the Seed Process

**Create the Database**

Open your terminal and create a new PostgreSQL database:

```
createdb -U postgres my_db_name
```

## Run the Initialization Script

Navigate to the directory where init.sql is located and execute it to create tables, add sample data, and verify the setup:

```
psql -U postgres -d my_db_name -f init.sql
```

## Verify the Installation

Connect to your database to make sure the sample data is loaded:

```
psql -U postgres -d my_db_name
```

### Then run:

```
SELECT * FROM transactions;
```
