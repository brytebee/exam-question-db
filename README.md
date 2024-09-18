# Exam-Manager

**Exam-Manager** is a powerful platform designed for educators to efficiently create, view, and manage exams and questions. Built with modern technologies like **Next.js**, **Prisma**, and **Tailwind CSS**, this platform simplifies exam administration and offers a user-friendly interface for dynamic management of educational content.

## Features

- **User Roles**: Support for various user roles, such as Admin, Teacher, and Student, allowing for customized access and permissions.
- **Exam Management**: Create, update, view, and delete exams seamlessly.
- **Question Bank**: Manage a library of questions with different types (multiple choice, true/false, etc.).
- **Dynamic Pagination**: Efficient navigation and management of large sets of questions and exams.
- **Responsive Design**: Fully responsive layout powered by Tailwind CSS for seamless use across devices.
- **User-Friendly Interface**: Simplified and intuitive UI/UX for educators and students.
- **Data Persistence**: All data is stored in a PostgreSQL database via Prisma ORM.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) - A React framework for building server-side rendered and static websites.
- **Backend**: Node.js with [Next.js API routes](https://nextjs.org/docs/api-routes/introduction) for managing the server-side logic.
- **Database**: [Prisma](https://www.prisma.io/) as the ORM for interacting with a PostgreSQL database.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for building responsive and modern UI components.
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) for handling user authentication and session management.
- **Deployment**: The app can be deployed on platforms like Vercel or Heroku.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v14+)
- [PostgreSQL](https://www.postgresql.org/) (or any other supported database)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/exam-manager.git
   ```

2. **Install dependencies**:

   ```bash
   cd exam-manager
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env` file in the root directory and fill in the following:

   ```bash
   DATABASE_URL=postgresql://username:password@localhost:5432/exam_manager
   NEXTAUTH_SECRET=your_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run database migrations**:

   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**:

   ```bash
   npm run dev
   ```

   The app will be running on [http://localhost:3000](http://localhost:3000).

### Prisma Studio

To easily manage and inspect the database, use Prisma Studio:

```bash
npx prisma studio
```

## Usage

- **Admin Role**: Create and manage exams, questions, and user roles.
- **Teacher Role**: Access to exam creation and question management.
- **Student Role**: Ability to view exams and submit answers.

## Deployment

To deploy the application, you'll need to configure the environment variables in the target environment (e.g., Vercel, Heroku) and set up a database.

### Steps for Deployment

1. **Deploy on Vercel**:

   - Push the code to GitHub and connect your repository with Vercel.
   - Add the environment variables in the Vercel dashboard.
   - Click on **Deploy**.

2. **Database Setup**:

   Ensure that your database URL is correctly set up in the production environment, and that Prisma migrations are applied.

```bash
npx prisma migrate deploy
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs or feature requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
