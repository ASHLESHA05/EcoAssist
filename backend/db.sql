CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    location TEXT,
    preferences JSONB DEFAULT '{}'::jsonb || '{"dailyTips": true, "achievementAlert": true, "friendActivity": true}'::jsonb,
    created_at TIMESTAMP DEFAULT now(),
    is_public BOOLEAN DEFAULT TRUE,
    level INT DEFAULT 1,
    level_progress INT DEFAULT 0
);

CREATE TABLE activities (
    activity_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    carbon_impact NUMERIC NOT NULL,
    timestamp TIMESTAMP DEFAULT now(),
    details JSONB
);

CREATE TABLE monthly_carbon_summary (
    summary_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    month INT CHECK (month >= 1 AND month <= 12),
    year INT CHECK (year >= 2000),
    total_carbon NUMERIC NOT NULL,
    reduction_percentage NUMERIC,
    category_breakdown JSONB
);

CREATE TABLE points (
    point_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    amount INT NOT NULL,
    reason TEXT,
    timestamp TIMESTAMP DEFAULT now(),
    status TEXT CHECK (status IN ('active', 'inactive', 'redeemed'))
);

CREATE TABLE badges (
    badge_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    criteria TEXT
);

CREATE TABLE user_badges (
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(badge_id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (user_id, badge_id)
);

CREATE TABLE connections (
    connection_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    friend_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('pending', 'accepted')),
    created_at TIMESTAMP DEFAULT now(),
    CONSTRAINT unique_friendship UNIQUE (user_id, friend_id)
);

CREATE TABLE recommendations (
    recommendation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMP DEFAULT now(),
    is_implemented BOOLEAN DEFAULT FALSE
);

CREATE TABLE redemption_options (
    option_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    points_required INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);
