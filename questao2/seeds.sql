INSERT INTO department (name) VALUES
  ('Matemática'),
  ('Computação'),
  ('Física');

INSERT INTO title (name) VALUES
  ('Professor Assistente'),
  ('Professor Adjunto'),
  ('Professor Titular');

INSERT INTO professor (name, department_id, title_id) VALUES
  ('Maria Silva', 1, 2),
  ('João Souza',  2, 3),
  ('Ana Costa',   2, 1),
  ('Carlos Lima', 3, 2);


INSERT INTO building (name) VALUES
  ('Bloco A'),
  ('Bloco B');

INSERT INTO room (name, building_id) VALUES
  ('Sala 101', 1),
  ('Sala 102', 1),
  ('Laboratório 201', 2),
  ('Laboratório 202', 2);

INSERT INTO subject (code, name) VALUES
  ('MAT101', 'Cálculo I'),
  ('COMP201','Estruturas de Dados'),
  ('COMP301','Banco de Dados'),
  ('FIS101', 'Física Geral');

INSERT INTO subject_prerequisite (subject_id, prerequisiteid) VALUES
  ((SELECT id FROM subject WHERE code='COMP301'),
   (SELECT id FROM subject WHERE code='COMP201'));

INSERT INTO class (subject_id, year, semester, code, professor_id) VALUES
  ((SELECT id FROM subject WHERE code='MAT101'), 2025, 1, 'A', 1),
  ((SELECT id FROM subject WHERE code='COMP201'),2025, 1, 'A', 2),
  ((SELECT id FROM subject WHERE code='COMP301'),2025, 1, 'A', 3),
  ((SELECT id FROM subject WHERE code='FIS101'), 2025, 1, 'A', 4);

INSERT INTO class_schedule (class_id, room_id, day_of_week, start_time, end_time) VALUES
  ((SELECT id FROM class WHERE subject_id=(SELECT id FROM subject WHERE code='MAT101')),
   (SELECT id FROM room WHERE name='Sala 101'), 1, '08:00', '10:00'),
  ((SELECT id FROM class WHERE subject_id=(SELECT id FROM subject WHERE code='MAT101')),
   (SELECT id FROM room WHERE name='Sala 101'), 3, '08:00', '10:00'),

  ((SELECT id FROM class WHERE subject_id=(SELECT id FROM subject WHERE code='COMP201')),
   (SELECT id FROM room WHERE name='Laboratório 201'), 2, '14:00', '17:00'),

  ((SELECT id FROM class WHERE subject_id=(SELECT id FROM subject WHERE code='COMP301')),
   (SELECT id FROM room WHERE name='Laboratório 201'), 4, '14:00', '17:00'),

  ((SELECT id FROM class WHERE subject_id=(SELECT id FROM subject WHERE code='FIS101')),
   (SELECT id FROM room WHERE name='Sala 102'), 5, '09:00', '11:00');