@echo off
echo Setting up Tuvi AI Web development environment...

REM Copy environment files
if not exist .env (
    copy .env.example .env
    echo Created .env file
) else (
    echo .env already exists
)

if not exist client\.env (
    copy client\.env.example client\.env
    echo Created client/.env file
) else (
    echo client/.env already exists
)

REM Install dependencies
echo Installing dependencies...
call pnpm install

REM Setup database
echo Setting up database...
call pnpm db:push

echo.
echo Setup complete! You can now run:
echo   pnpm dev    - Start development server
echo   pnpm build  - Build for production
echo   pnpm start  - Start production server
echo.
echo Don't forget to edit .env and client/.env with your configuration!
pause
