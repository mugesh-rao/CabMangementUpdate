# Cab Management System for IT Employees and Customer Assignments

**Cab Management System** is a platform designed to efficiently manage the transportation of IT employees and customers by assigning them to driver employees. The project is built using the **MERN stack** (MongoDB, Express, React, Node.js), **Firebase** for authentication and real-time updates, **Serverless Functions** for backend tasks, and **WhatsApp API** for communication.

### Status

Currently working on backend functionality and ensuring all core features are functional before focusing on creating an elegant UI for the platform. The focus is on building a stable and reliable system for driver assignments and real-time updates.

## Features

- **Employee and Customer Management**: Manage employee and customer profiles, with detailed assignment information.
- **Driver Assignment**: Efficiently assign IT employees and customers to available drivers based on proximity and availability.
- **Real-Time Updates**: Firebase-powered real-time updates for driver status, booking confirmations, and employee assignments.
- **WhatsApp Notifications**: Integration with WhatsApp API for automatic notifications and communication with employees, customers, and drivers.
- **Backend Functions**: Implemented serverless functions for backend tasks, such as notifications and assignment handling.

## Technologies Used

- **Frontend**:
  - **React**: For building the user interface.
  - **TailwindCSS**: For styling, though UI improvements are planned once backend functionality is fully operational.
  - **React Router**: For page navigation within the app.
  - **Axios**: For interacting with backend APIs.

- **Backend**:
  - **Node.js** and **Express**: For building the backend REST API for cab management and driver assignments.
  - **Firebase**: For user authentication, real-time updates via Firestore, and managing driver statuses.
  - **Serverless Functions**: To handle backend processes without maintaining servers, improving scalability and reducing costs.
  - **WhatsApp API**: To send notifications and updates to employees, customers, and drivers.

- **Database**:
  - **MongoDB**: Used for storing employee, customer, driver, and booking data in a NoSQL format.

## Development Focus

### Current Focus:
- **Backend stability**: Ensuring that core functionality such as assigning drivers, booking rides, and handling notifications works as expected.
- **Real-time Updates**: Making sure Firebase triggers real-time notifications for driver assignments and updates.
- **WhatsApp Integration**: Establishing stable communication with WhatsApp API to send messages to users.
  
Once backend functionality is stable, the project will shift focus to **UI enhancements** to make the platform visually appealing and user-friendly.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mugesh-rao/cab-management-system.git
