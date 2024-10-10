// app/about/page.tsx
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 lg:px-8">
      <h1 className="text-4xl font-bold mb-4 text-green-600">About DuaLink</h1>
      <p className="text-lg text-gray-700 max-w-3xl text-center mb-8">
        At DuaLink, we believe in the power of faith and community. Our platform is a place where Muslims from across the world can connect, share, and offer support through heartfelt supplications (duas). In a world that can sometimes feel overwhelming, DuaLink seeks to bring solace, comfort, and unity by fostering a global space dedicated to spiritual growth and compassion.
      </p>

      {/* Global Community Image */}
      <div className="mb-8 w-full max-w-2xl">
        <Image 
          src="/images/community.jpg" 
          alt="Global Community" 
          width={800} 
          height={600} 
          layout="responsive"
          className="rounded-lg shadow-lg"
        />
      </div>

      <div className="text-lg text-gray-600 mb-8 max-w-2xl text-center">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="mb-4">
          DuaLink&apos;s mission is simple: to provide a platform where people can request and offer prayers, and engage in meaningful acts of spiritual support. We want to create a global network of Muslims who uplift one another, strengthen their connection to Allah (SWT), and find solace in collective prayer.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Why DuaLink?</h2>
        <ul className="list-disc list-inside mb-4">
          <li><strong>A Global Community</strong>: DuaLink brings together Muslims from every corner of the world, allowing you to share your dua requests and provide support to others in times of need.</li>
          <li><strong>Spiritual Solidarity</strong>: Whether you are seeking strength, healing, or guidance, or you want to pray for the well-being of others, DuaLink provides a platform for collective worship and community engagement.</li>
          <li><strong>A Safe Space for Personal Supplications</strong>: Our platform is designed with your privacy in mind. Feel free to share your dua requests, knowing they will be met with kindness, sincerity, and confidentiality.</li>
        </ul>
      </div>

      {/* Spiritual Support Image */}
      <div className="mb-8 w-full max-w-2xl">
        <Image 
          src="/images/spiritual_support.jpg" 
          alt="Spiritual Support" 
          width={800} 
          height={600} 
          layout="responsive"
          className="rounded-lg shadow-lg"
        />
      </div>

      <div className="text-lg text-gray-600 mb-8 max-w-2xl text-center">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <p className="mb-4">
          DuaLink offers a simple, yet powerful way to engage with others spiritually:
        </p>
        <ul className="list-disc list-inside">
          <li><strong>Share Your Duas</strong>: Post your dua requests, whether for yourself, a loved one, or the greater Muslim community. Your supplications will be seen by fellow Muslims ready to offer their prayers and support.</li>
          <li><strong>Offer Prayers</strong>: Browse through the dua requests and lend your prayers to those in need. When you find a supplication that resonates with you, offer your own dua in response and let others know you are praying for them.</li>
          <li><strong>Personalized Inspiration</strong>: For each dua you post, you will receive words of inspiration to help strengthen your faith and provide spiritual encouragement in difficult times.</li>
        </ul>
      </div>

      <div className="text-lg text-gray-600 mb-8 max-w-2xl text-center">
        <h2 className="text-2xl font-semibold mb-4">Our Core Values</h2>
        <p className="mb-4">
          DuaLink is grounded in a set of core values that reflect our dedication to creating a spiritually supportive and meaningful platform:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Compassion</strong>: We believe in the importance of kindness and empathy. Every dua shared or responded to is an act of compassion, and our community thrives on this principle.</li>
          <li><strong>Unity</strong>: Our platform brings together Muslims of all backgrounds and nationalities, fostering unity through shared faith and prayer.</li>
          <li><strong>Faith</strong>: DuaLink is deeply rooted in Islamic principles, providing a space for Muslims to strengthen their faith and seek solace in their connection to Allah (SWT).</li>
          <li><strong>Confidentiality</strong>: We respect the privacy of all users. Your supplications are treated with the utmost care, and we ensure a respectful environment where every dua is valued.</li>
        </ul>
      </div>

      <p className="text-lg text-gray-700 max-w-3xl text-center mb-12">
        We welcome you to join us in building a community of prayer and support. DuaLink is more than just a platform – it&apos;s a place where the power of dua transcends boundaries, and where individuals can come together to support one another through their faith.
      </p>

      <Link href="/" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
        Back to Home
      </Link>
    </div>
  );
}