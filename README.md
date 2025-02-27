## Sushi Restaurant Management System

We are assigned to design a sushi restaurant management system based on the provided requirement specification. This project is expected to include system design, database setup, implementation of system-layer procedures, and applying indexes and partitioning on tables to optimize transactions. The web part is only expected to display information, so we used an MVC model without a full frontend implementation.

In this project, I participated in system design, database design, writing SQL procedures to handle transactions, and designing & implementing indexes to optimize transaction performance. I did not participate in the web development.

## Project Steps

1. **ER Model Construction:**  
   - Analyze the requirement specification to identify key entities and relationships.
   - Develop an initial ER diagram that captures all aspects of the sushi restaurant system.

2. **Logical Design:**  
   - Convert the ER diagram into a detailed relational schema.
   - Define primary keys, foreign keys, and other constraints.
   - Normalize the schema (ensuring 1NF, 2NF, and 3NF).

3. **Physical Design:**  
   - Develop SQL scripts to create tables and enforce relationships.
   - Implement indexes, partitions, and other performance optimizations.
   - Organize storage based on query frequency and transaction requirements.

4. **Implementation:**  
   - Write stored procedures, functions, and triggers to encapsulate business logic (e.g., order processing, membership updates).
   - Generate test data (aiming for around 100,000 rows per key table) to validate performance and data integrity.
   - Build a user interface using the MVC model to support functionalities such as login, dish search, table reservations, and order processing.

**Note:** To fully understand the entire system design, you can check out the file [report.pdf](./Report.pdf)





  
 

## What I learned from this project:
**Note:** This project has shortcomings in the fake data generation (the integrity of relationships is not fully ensured) and some indexes are not efficient.
  
I enjoy this project because it gives me the opportunity to understand and experience how to build a system from scratch, which is very different from typical software development. I feel that in real small projects, many might not design the system as thoroughly as I did, often taking a different approach compared to what I learned in my software courses.


