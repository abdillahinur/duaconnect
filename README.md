
# DuaConnect

**DuaConnect** is a web platform designed for Muslims to submit, share, and respond to Dua (supplication) requests in a supportive and community-driven environment. Whether you're seeking prayers for personal challenges, health, success, or gratitude, DuaConnect provides an easy-to-use space to connect with others in faith and devotion.

## Features

- **Submit Dua Requests**: Easily submit your own Dua requests to the community, specifying what you seek prayers for.
- **Community Support**: Other users can view and make Dua for your requests, creating a shared sense of purpose and support.
- **Islamic Dua Resources**: Access a library of Duas from the Quran and Sunnah, curated to assist users in various aspects of life.
- **Daily Dua Reminders**: Set daily reminders to make Duas for yourself and others, enhancing your spiritual routine.
- **Multilingual Support**: Available in multiple languages, including Arabic and English.
- **AI-Powered Suggestions**: Leverage AI from OpenAI to provide personalized Dua suggestions and insights based on user input.

## How It Works

1. **Create an Account**: Sign up to start submitting, browsing, and responding to Dua requests.
2. **Submit a Request**: Describe your situation and what you'd like the community to pray for.
3. **Make Dua for Others**: Browse other requests and offer your support by making Duas on behalf of other users.
4. **AI-Powered Dua Suggestions**: Use OpenAI’s powerful language model to receive Dua suggestions based on your specific needs.
5. **Dua Notifications**: Receive notifications when others make Dua for you.
6. **Dua Resources**: Explore the library of Quranic verses and authentic Hadiths that offer guidance on making Duas.

## Technology Stack

- **Frontend**: Built with [Next.js](https://nextjs.org/), providing fast and dynamic user interfaces.
- **Backend & Database**: Powered by [Supabase](https://supabase.io/), handling authentication, real-time data, and database management.
- **AI Integration**: [OpenAI](https://openai.com/) is integrated to provide personalized Dua suggestions and intelligent features.
- **Authentication**: Secure user authentication with Supabase.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/abdillahinur/duaconnect.git
    ```

2. Navigate to the project directory:

    ```bash
    cd duaconnect
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up environment variables for Supabase and OpenAI by creating a `.env.local` file:

    ```
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    OPENAI_API_KEY=your-openai-api-key
    ```

5. Start the development server:

    ```bash
    npm run dev
    ```

6. Open [http://localhost:3000](http://localhost:3000) to view the app.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request and provide details of your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support & Feedback

If you have any questions, feedback, or feature requests, feel free to open an issue or reach out via email.
