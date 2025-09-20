CREATE TABLE department (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE title (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE professor (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  department_id INT REFERENCES department(id),
  title_id INT REFERENCES title(id)
);

CREATE TABLE building (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE room (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  building_id INT REFERENCES building(id)
);

CREATE TABLE subject (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL
);

CREATE TABLE subject_prerequisite (
  id SERIAL PRIMARY KEY,
  subject_id INT NOT NULL REFERENCES subject(id),
  prerequisiteid INT NOT NULL REFERENCES subject(id)
);

CREATE TABLE class (
  id SERIAL PRIMARY KEY,
  subject_id INT REFERENCES subject(id),
  year INT,
  semester INT,
  code TEXT,
  professor_id INT REFERENCES professor(id)
);

CREATE TABLE class_schedule (
  id SERIAL PRIMARY KEY,
  class_id INT REFERENCES class(id),
  room_id INT REFERENCES room(id),
  day_of_week INT,        
  start_time TIME,
  end_time TIME
);