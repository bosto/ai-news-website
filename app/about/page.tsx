import { Bot, Sparkles, Users, Globe, Shield, Zap } from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Content',
      description: 'Our articles are written by advanced AI authors specialized in different areas of artificial intelligence.',
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'We monitor and summarize news from leading AI companies and research institutions worldwide.',
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Stay informed with the latest developments as they happen in the fast-moving AI landscape.',
    },
    {
      icon: Shield,
      title: 'Accurate & Reliable',
      description: 'All content is fact-checked and verified to ensure accuracy and reliability.',
    },
    {
      icon: Sparkles,
      title: 'Expert Analysis',
      description: 'Get deeper insights with expert analysis and commentary on industry trends.',
    },
    {
      icon: Users,
      title: 'Community Focused',
      description: 'Built for AI researchers, developers, and enthusiasts who want to stay ahead.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-lg mb-6">
          <Bot className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About AI News Hub
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          The premier destination for AI news written by AI authors and curated from 
          leading AI companies. We bring you the most important developments in artificial 
          intelligence with expert analysis and timely updates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="card text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                <Icon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-8 mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            To democratize access to AI news and insights by leveraging artificial intelligence 
            to create comprehensive, accurate, and timely coverage of the rapidly evolving AI landscape.
          </p>
          <p className="text-gray-600">
            We believe that AI can help us better understand AI. Our platform combines the 
            speed and scalability of artificial intelligence with human oversight to deliver 
            news that matters to the AI community.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How We Work
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-primary-600 font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Data Collection</h3>
                <p className="text-gray-600">We continuously monitor news from leading AI companies, research institutions, and industry publications.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-primary-600 font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Analysis</h3>
                <p className="text-gray-600">Our AI authors analyze trends, synthesize information, and generate comprehensive articles with unique insights.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-primary-600 font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Quality Assurance</h3>
                <p className="text-gray-600">Every article undergoes fact-checking and quality review to ensure accuracy and reliability.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Coverage Areas
          </h2>
          <ul className="space-y-3">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
              <span className="text-gray-700">Machine Learning Research & Breakthroughs</span>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
              <span className="text-gray-700">AI Industry News & Market Developments</span>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
              <span className="text-gray-700">Ethics, Policy & Governance</span>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
              <span className="text-gray-700">Real-world AI Applications</span>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
              <span className="text-gray-700">Startup & Investment News</span>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
              <span className="text-gray-700">Technical Tutorials & Guides</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center bg-gray-900 text-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">
          Join Our Community
        </h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Stay connected with the latest AI developments. Follow us for daily updates, 
          breaking news, and in-depth analysis from our AI authors.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
            Subscribe to Newsletter
          </button>
          <button className="bg-transparent border border-gray-600 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors">
            Follow on Social Media
          </button>
        </div>
      </div>
    </div>
  );
}