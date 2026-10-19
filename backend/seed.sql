-- 12 sample records (loaded automatically only when the table is empty)
INSERT INTO timetable (course_code, course_name, lecturer, day_of_week, start_time, end_time, venue, goal) VALUES
('ICT251', 'Web Technologies',          'Mr. Banda',   'Monday',    '08:00', '10:00', 'Lab 1',        'Deploy my portfolio site'),
('ICT221', 'Database Systems',          'Dr. Phiri',   'Monday',    '10:30', '12:30', 'Room B12',     'Master SQL joins'),
('ICT231', 'Data Structures',           'Ms. Mwansa',  'Tuesday',   '08:00', '10:00', 'Room A3',      'Implement a linked list'),
('MAT201', 'Discrete Mathematics',      'Dr. Zulu',    'Tuesday',   '11:00', '13:00', 'Lecture Hall 2','Finish all tutorial sheets'),
('ICT241', 'Operating Systems',         'Mr. Tembo',   'Wednesday', '09:00', '11:00', 'Lab 2',        'Understand process scheduling'),
('COM101', 'Communication Skills',      'Mrs. Chanda', 'Wednesday', '14:00', '16:00', 'Room C5',      'Submit the report on time'),
('ICT261', 'Computer Networks',         'Mr. Lungu',   'Thursday',  '08:00', '10:00', 'Lab 3',        'Configure a small LAN'),
('ICT271', 'Software Engineering',      'Dr. Sakala',  'Thursday',  '10:30', '12:30', 'Room B7',      'Draw UML diagrams for the group project'),
('ICT281', 'Object-Oriented Programming','Ms. Daka',   'Friday',    '08:00', '10:00', 'Lab 1',        'Build a Java mini-project'),
('STA201', 'Probability and Statistics','Dr. Mumba',   'Friday',    '10:30', '12:30', 'Room A1',      'Score above 70% in the test'),
('ICT291', 'Mobile Application Basics', 'Mr. Kunda',   'Saturday',  '09:00', '11:00', 'Lab 2',        'Publish a simple Android app'),
('ICT299', 'Research Methods',          'Dr. Nyirenda','Saturday',  '11:30', '13:30', 'Room B2',      'Choose a final-year project topic');
