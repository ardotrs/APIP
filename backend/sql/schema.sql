CREATE TYPE user_role AS ENUM ('Admin', 'Pimpinan', 'Auditor');
CREATE TYPE assignment_status AS ENUM ('Perencanaan', 'Berjalan', 'Selesai', 'Dibatalkan');

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE employees (
  id BIGSERIAL PRIMARY KEY,
  nip VARCHAR(30) UNIQUE NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  position VARCHAR(100) NOT NULL,
  division VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE assignments (
  id BIGSERIAL PRIMARY KEY,
  letter_number VARCHAR(120) UNIQUE NOT NULL,
  letter_date DATE NOT NULL,
  activity_name VARCHAR(200) NOT NULL,
  location VARCHAR(150) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  team_name VARCHAR(120) NOT NULL,
  leader_id BIGINT REFERENCES employees(id),
  status assignment_status DEFAULT 'Perencanaan',
  document_path TEXT,
  created_by BIGINT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE assignment_team_members (
  assignment_id BIGINT REFERENCES assignments(id) ON DELETE CASCADE,
  employee_id BIGINT REFERENCES employees(id),
  PRIMARY KEY (assignment_id, employee_id)
);

CREATE TABLE audit_trails (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  action VARCHAR(40) NOT NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id BIGINT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_assignments_date_range ON assignments(start_date, end_date);
CREATE INDEX idx_assignment_members_employee ON assignment_team_members(employee_id);

-- Seed admin user (password: Admin@123)
INSERT INTO users (username, full_name, password_hash, role)
VALUES ('admin', 'Administrator SIP-PEDAS', '$2a$10$Nh62Qx6f7Kw87/mMRM4LZuM.HB0I7oGf6hXZj43iMPrjXN7j6yQqq', 'Admin');
