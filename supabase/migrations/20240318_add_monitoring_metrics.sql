-- Habilitar la extensión pgcrypto si no está habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabla para métricas del sistema
CREATE TABLE IF NOT EXISTS system_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Tabla para logs del sistema
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    log_level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    source VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Tabla para alertas
CREATE TABLE IF NOT EXISTS system_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Tabla para métricas de rendimiento
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    endpoint VARCHAR(255),
    response_time INTEGER,
    status_code INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Tabla para métricas de usuarios
CREATE TABLE IF NOT EXISTS user_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Función para registrar métricas del sistema
CREATE OR REPLACE FUNCTION record_system_metric(
    p_metric_name VARCHAR,
    p_metric_value DECIMAL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_metric_id UUID;
BEGIN
    INSERT INTO system_metrics (
        metric_name,
        metric_value,
        metadata
    )
    VALUES (
        p_metric_name,
        p_metric_value,
        p_metadata
    )
    RETURNING id INTO v_metric_id;

    RETURN v_metric_id;
END;
$$;

-- Función para registrar logs del sistema
CREATE OR REPLACE FUNCTION record_system_log(
    p_log_level VARCHAR,
    p_message TEXT,
    p_source VARCHAR DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO system_logs (
        log_level,
        message,
        source,
        metadata
    )
    VALUES (
        p_log_level,
        p_message,
        p_source,
        p_metadata
    )
    RETURNING id INTO v_log_id;

    RETURN v_log_id;
END;
$$;

-- Función para crear alertas
CREATE OR REPLACE FUNCTION create_system_alert(
    p_alert_type VARCHAR,
    p_severity VARCHAR,
    p_message TEXT,
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_alert_id UUID;
BEGIN
    INSERT INTO system_alerts (
        alert_type,
        severity,
        message,
        metadata
    )
    VALUES (
        p_alert_type,
        p_severity,
        p_message,
        p_metadata
    )
    RETURNING id INTO v_alert_id;

    RETURN v_alert_id;
END;
$$;

-- Políticas de seguridad
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;

-- Políticas para system_metrics
CREATE POLICY "Admin users can view system metrics"
    ON system_metrics FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Políticas para system_logs
CREATE POLICY "Admin users can view system logs"
    ON system_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Políticas para system_alerts
CREATE POLICY "Admin users can view system alerts"
    ON system_alerts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Políticas para performance_metrics
CREATE POLICY "Admin users can view performance metrics"
    ON performance_metrics FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Políticas para user_metrics
CREATE POLICY "Users can view their own metrics"
    ON user_metrics FOR SELECT
    USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Índices para optimizar consultas
CREATE INDEX idx_system_metrics_name_time ON system_metrics(metric_name, timestamp);
CREATE INDEX idx_system_logs_level_time ON system_logs(log_level, timestamp);
CREATE INDEX idx_system_alerts_type_status ON system_alerts(alert_type, status);
CREATE INDEX idx_performance_metrics_endpoint_time ON performance_metrics(endpoint, timestamp);
CREATE INDEX idx_user_metrics_user_time ON user_metrics(user_id, timestamp); 