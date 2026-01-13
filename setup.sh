#!/bin/bash
echo "Setting up Tuvi AI Web development environment..."

# Copy environment files
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file"
else
    echo ".env already exists"
fi

if [ ! -f client/.env ]; then
    cp client/.env.example client/.env
    echo "Created client/.env file"
else
    echo "client/.env already exists"
fi

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Setup database
echo "Setting up database..."
pnpm db:push

echo ""
echo "Setup complete! You can now run:"
echo "  pnpm dev    - Start development server"
echo "  pnpm build  - Build for production"
echo "  pnpm start  - Start production server"
echo ""
echo "Don't forget to edit .env and client/.env with your configuration!"
