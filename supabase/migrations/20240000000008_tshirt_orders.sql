-- Create tshirt_orders table
CREATE TABLE IF NOT EXISTS tshirt_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  tshirt_color VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  material VARCHAR(50) NOT NULL,
  size VARCHAR(10) NOT NULL,
  delivery_location TEXT NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tshirt_orders_user_id ON tshirt_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_tshirt_orders_status ON tshirt_orders(status);
CREATE INDEX IF NOT EXISTS idx_tshirt_orders_created_at ON tshirt_orders(created_at);

-- Enable RLS
ALTER TABLE tshirt_orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own orders" ON tshirt_orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON tshirt_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON tshirt_orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow anonymous orders (for non-authenticated users)
CREATE POLICY "Allow anonymous orders" ON tshirt_orders
  FOR INSERT WITH CHECK (user_id IS NULL);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_tshirt_orders_updated_at
  BEFORE UPDATE ON tshirt_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 