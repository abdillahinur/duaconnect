# DuaLink

DuaLink is a platform where Muslims from all over the world can connect, share, and offer support through heartfelt supplications (duas). It provides a safe and private space for personal supplications, allowing users to engage in collective worship and spiritual support.

## Features

- **Dua Board**: Share your duas and support others by offering prayers in response to their requests.
- **Global Community**: Join Muslims worldwide in collective worship and solidarity.
- **Spiritual Support**: Receive words of inspiration for each dua you post, helping you strengthen your faith in difficult times.

## How It Works

1. **Share Your Duas**: Post your dua requests for yourself, your loved ones, or the wider Muslim community.
2. **Offer Prayers**: Respond to others' dua requests by offering your prayers and showing support.
3. **Receive Inspiration**: Get personalized inspirational words for every dua request to guide and strengthen your faith.

## Core Values

- **Compassion**: Acts of kindness and empathy are at the heart of DuaLink.
- **Unity**: Bringing Muslims together from diverse backgrounds and cultures through shared faith.
- **Faith**: Strengthening the connection with Allah (SWT) through collective prayers.
- **Confidentiality**: Your supplications are treated with privacy and care, ensuring a safe space for personal reflection.

## Usage

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dualink.git
   cd dualink
   ```

2. Set up environment variables:
   Create a `.env.local` file in the root directory with the following keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   GOOGLE_API_KEY=your-google-api-key
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

## API Routes

DuaLink uses an API to validate dua content and provide related Quranic ayahs using Google APIs.

- `POST /api/google-check-dua`: Validates the submitted dua and provides related inspirational ayahs from the Quran.

## Deployment

DuaLink is hosted on Vercel. To deploy the application, link your GitHub repository to Vercel and push your changes. Vercel will handle the build and deployment automatically.

## Contributing

We welcome contributions from the community! Here's how you can get involved:

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Open a pull request.

## License

DuaLink is licensed under the MIT License.

## Contact

If you have any questions or need help, feel free to contact us:

- Email: support@dualink.com
- Twitter: [@AbdillahiNur_](https://twitter.com/AbdillahiNur_)
