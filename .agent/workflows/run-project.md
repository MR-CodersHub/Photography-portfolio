# How to Run the Photography Portfolio Project

Follow these steps to set up and run the project locally using XAMPP.

## 1. Prerequisites
- **XAMPP** installed (Apache & MySQL).
- Project files located in `C:\xampp\htdocs\Photography Portfolio`.

## 2. Start Services
1. Open the **XAMPP Control Panel**.
2. Start the **Apache** and **MySQL** modules.

## 3. Database Configuration
1. Open your browser and go to [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/).
2. Click on **New** in the left sidebar.
3. Database name: `photography_portfolio`.
4. Click **Create**.
5. Select the `photography_portfolio` database.
6. Click the **Import** tab.
7. Click **Choose File** and select:
   `C:\xampp\htdocs\Photography Portfolio\sql\schema.sql`
8. Scroll down and click **Import**.

## 4. Accessing the Application
- **Frontend**: [http://localhost/Photography Portfolio/Home/index.html](http://localhost/Photography Portfolio/Home/index.html)
- **Admin Dashboard**: [http://localhost/Photography Portfolio/admin/](http://localhost/Photography Portfolio/admin/)

## 5. Admin Login Credentials
- **Email**: `admin@example.com`
- **Password**: `admin123`
