-- Habilitar la extensión pgcrypto si no está habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabla para productos de mercado
CREATE TABLE IF NOT EXISTS market_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID REFERENCES problems(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    company VARCHAR(255),
    market_share DECIMAL(5,2),
    price_range JSONB,
    features JSONB,
    limitations TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para análisis comparativo
CREATE TABLE IF NOT EXISTS product_comparisons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market_product_id UUID REFERENCES market_products(id),
    feature_name VARCHAR(255) NOT NULL,
    feature_value TEXT,
    comparison_score INTEGER CHECK (comparison_score BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para propuestas de innovación
CREATE TABLE IF NOT EXISTS innovation_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market_product_id UUID REFERENCES market_products(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    potential_impact INTEGER CHECK (potential_impact BETWEEN 1 AND 5),
    implementation_complexity INTEGER CHECK (implementation_complexity BETWEEN 1 AND 5),
    market_potential DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para generar análisis de productos de mercado
CREATE OR REPLACE FUNCTION generate_market_products_analysis(problem_id UUID)
RETURNS UUID[]
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    product_ids UUID[];
BEGIN
    -- Aquí se integraría la lógica de IA para analizar los productos
    -- y generar el análisis comparativo y propuestas de innovación

    RETURN product_ids;
END;
$$;

-- Políticas de seguridad
ALTER TABLE market_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE innovation_proposals ENABLE ROW LEVEL SECURITY;

-- Políticas para market_products
CREATE POLICY "Users can view market products for their problems"
    ON market_products FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM problems
            WHERE problems.id = market_products.problem_id
            AND problems.creator_id = auth.uid()
        )
    );

-- Políticas para product_comparisons
CREATE POLICY "Users can view product comparisons for their market products"
    ON product_comparisons FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM market_products
            JOIN problems ON problems.id = market_products.problem_id
            WHERE market_products.id = product_comparisons.market_product_id
            AND problems.creator_id = auth.uid()
        )
    );

-- Políticas para innovation_proposals
CREATE POLICY "Users can view innovation proposals for their market products"
    ON innovation_proposals FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM market_products
            JOIN problems ON problems.id = market_products.problem_id
            WHERE market_products.id = innovation_proposals.market_product_id
            AND problems.creator_id = auth.uid()
        )
    ); 