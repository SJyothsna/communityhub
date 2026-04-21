-- Drop tables if they exist (for clean restart)
DROP TABLE IF EXISTS service_recommendations;
DROP TABLE IF EXISTS community_services;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS providers;
DROP TABLE IF EXISTS subcategories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS communities;

-- 1. Communities Table
CREATE TABLE communities (
    community_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    community_name VARCHAR(150) NOT NULL,
    description TEXT,
    city VARCHAR(100),
    area VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE categories (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    category_type VARCHAR(50),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Subcategories Table
CREATE TABLE subcategories (
    subcategory_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    subcategory_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_subcategories_category
        FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- 4. Providers Table
CREATE TABLE providers (
    provider_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    provider_name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(150),
    phone_number VARCHAR(30),
    email VARCHAR(150),
    whatsapp_number VARCHAR(30),
    address_line1 VARCHAR(200),
    address_line2 VARCHAR(200),
    city VARCHAR(100),
    area VARCHAR(100),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Services Table
CREATE TABLE services (
    service_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    provider_id BIGINT NOT NULL,
    subcategory_id BIGINT NOT NULL,
    service_name VARCHAR(150) NOT NULL,
    short_description VARCHAR(300),
    full_description TEXT,
    service_mode VARCHAR(50),
    age_group VARCHAR(50),
    price_info VARCHAR(150),
    area_served VARCHAR(200),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_services_provider
        FOREIGN KEY (provider_id) REFERENCES providers(provider_id),
    CONSTRAINT fk_services_subcategory
        FOREIGN KEY (subcategory_id) REFERENCES subcategories(subcategory_id)
);

-- 6. Community Services Mapping Table
CREATE TABLE community_services (
    community_service_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    community_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    added_by VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_community_services_community
        FOREIGN KEY (community_id) REFERENCES communities(community_id),
    CONSTRAINT fk_community_services_service
        FOREIGN KEY (service_id) REFERENCES services(service_id),
    CONSTRAINT uq_community_service UNIQUE (community_id, service_id)
);

-- 7. Service Recommendations Table
CREATE TABLE service_recommendations (
    recommendation_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    service_id BIGINT NOT NULL,
    community_id BIGINT NOT NULL,
    recommender_name VARCHAR(150),
    recommender_note VARCHAR(500),
    status VARCHAR(30) NOT NULL DEFAULT 'APPROVED',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recommendations_service
        FOREIGN KEY (service_id) REFERENCES services(service_id),
    CONSTRAINT fk_recommendations_community
        FOREIGN KEY (community_id) REFERENCES communities(community_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_subcategories_category ON subcategories(category_id);
CREATE INDEX idx_services_provider ON services(provider_id);
CREATE INDEX idx_services_subcategory ON services(subcategory_id);
CREATE INDEX idx_community_services_community ON community_services(community_id);
CREATE INDEX idx_community_services_service ON community_services(service_id);
CREATE INDEX idx_recommendations_service ON service_recommendations(service_id);
CREATE INDEX idx_recommendations_community ON service_recommendations(community_id);

-- Made with Bob
