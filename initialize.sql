CREATE DATABASE pdfviewer;

USE pdfviewer;

CREATE TABLE misc(
    u_signup_key VARCHAR(10),
    admin_salt VARCHAR(20),
    admin_hpword VARCHAR(256),
    admin_key VARCHAR(10)
);

CREATE TABLE files(
    file_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(250),
    file_savedas VARCHAR(100)
);

CREATE TABLE users (
    u_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    u_name VARCHAR(50),
    u_email VARCHAR(100),
    u_salt VARCHAR(20),
    u_hpword VARCHAR(256),
    u_grpid INTEGER NULL
);

CREATE TABLE active_sessions(
    u_id INTEGER PRIMARY KEY,
    jwt_token TEXT,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `groups` (
    g_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    g_name VARCHAR(50),
    g_validtill DATETIME NULL
);

CREATE TABLE perms (
    p_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    file_id INTEGER,
    g_id INTEGER
);