-- create database
CREATE DATABASE test_tododb
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;

-- Note: for this queries I am using the public schema

-- create category table
CREATE TABLE public.category (
   category_id serial NOT NULL PRIMARY KEY,
   category_name character varying(100) NOT NULL
);

-- Insert categories
INSERT INTO public.category(category_name) VALUES('School');
INSERT INTO public.category(category_name) VALUES('Vacation');
INSERT INTO public.category(category_name) VALUES('Payment');
INSERT INTO public.category(category_name) VALUES('Household Chores');
INSERT INTO public.category(category_name) VALUES('Cooking');
INSERT INTO public.category(category_name) VALUES('Sports');

-- create todo table
CREATE TABLE public.todo
(
    todo_id serial NOT NULL,
    todo_desc character varying(255) NOT NULL,
    todo_date date NOT NULL,
    category_id integer NOT NULL,
    todo_remarks character varying(100) NOT NULL,
    PRIMARY KEY (todo_id),
    CONSTRAINT category_id FOREIGN KEY (category_id)
        REFERENCES public.category (category_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

-- Insert todos
INSERT INTO public.todo(todo_desc, todo_date, category_id, todo_remarks) 
VALUES('study math', CURRENT_DATE, 1, 'In Progress');
INSERT INTO public.todo(todo_desc, todo_date, category_id, todo_remarks) 
VALUES('study arts', CURRENT_DATE, 1, 'In Progress');
INSERT INTO public.todo(todo_desc, todo_date, category_id, todo_remarks) 
VALUES('pay rental bills', CURRENT_DATE, 3, 'In Progress');
INSERT INTO public.todo(todo_desc, todo_date, category_id, todo_remarks) 
VALUES('feed cat and dogs', CURRENT_DATE, 4, 'In Progress');
INSERT INTO public.todo(todo_desc, todo_date, category_id, todo_remarks) 
VALUES('clean bedroom', CURRENT_DATE, 4, 'In Progress');

-- create todo_list view in public schema
CREATE VIEW public.todo_list AS 
   SELECT t.todo_id, t.todo_desc, t.todo_date::VARCHAR, c.category_name, t.todo_remarks
   FROM todo AS "t"
   JOIN category AS "c" ON t.category_id = c.category_id
   ORDER BY t.todo_id;