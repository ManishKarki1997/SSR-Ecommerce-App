# Varya Commerce Application

Varya Commerce is a simple ecommerce application that you can check it out [here](https://ssr-ecommerce-app.vercel.app/)

URL -> https://ssr-ecommerce-app.vercel.app/

API repo for this project [here](https://github.com/ManishKarki1997/E-Commerce-Server)

#### Tech Stack Used

- Nuxt as the frontend
- Node JS as the backend
- Postgres Database (using Prisma as the ORM)
- Stripe Payment System
- Typescript (minimal, still learning myself)
- Cloudinary as the image hosting service
- Deployed to Vercel

## Features

- Search functionality, using query parameters like price range, categories, subcategories, filters like brand, color, storage, ram etc
- Cart and wishlist system, with Stripe payment support
- Flash sale products for a particular time
- Server Side Rendered, so some basic SEO functionalities included
- Admin dashboard to control products, categories, filters

#### Why I built this project

I built this project mainly because I wanted to learn about SSR, Typescript and Postgres. Typescript and Postgres is something I haven't used. I used typescript, although bare minimum, in the API server of this project, not on this one.
This project is in the ending phase, although there are some features that are to be added, and need to do some bug testing.

#### Missing features

- Password reset system and confirm registration system is missing
- bug testing and features
- ...

## Installation

##### 1. Make sure to spin up the API server, from [here](https://github.com/ManishKarki1997/E-Commerce-Server)

##### 2. Rename the .env.example file to .env only

It should look like this

```
CLOUD_NAME = [optional]
PRESET_NAME = [optional]
CLOUDINARY_API_KEY = [optional]
CLOUDINARY_API_SECRET = [optional]
STRIPE_PUBLISHABLE_KEY = [optional]
STRIPE_SECRET_KEY = [optional]
BACKEND_API_URL = http://localhost:4000/api
```

If you intend to use the dashboard (admin side), you may want to sign up for cloudinary if you want to manage product and categories images
The variables - CLOUD_NAME, PRESET_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET are all from cloudinary. These are optional

If you intend to use Stripe, fill in the Stripe variables

##### 3. Install the dependencies and devDependencies and start the server.

```sh
npm install
npm run dev
```

##### 4. App should be running in http://localhost:3000
