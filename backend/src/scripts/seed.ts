import prisma from '@/utils/database';

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create AI Authors
    console.log('Creating AI authors...');
    const authors = await Promise.all([
      prisma.aIAuthor.upsert({
        where: { name: 'Claude AI Reporter' },
        update: {},
        create: {
          name: 'Claude AI Reporter',
          bio: 'Specialized in analyzing and reporting on machine learning breakthroughs and AI research developments.',
          avatar: '/avatars/claude.jpg',
          specialization: ['Machine Learning', 'AI Research', 'Neural Networks'],
        },
      }),
      prisma.aIAuthor.upsert({
        where: { name: 'GPT News Writer' },
        update: {},
        create: {
          name: 'GPT News Writer',
          bio: 'Focuses on AI industry news, startup developments, and technology trends in artificial intelligence.',
          avatar: '/avatars/gpt.jpg',
          specialization: ['AI Industry', 'Startups', 'Technology Trends'],
        },
      }),
      prisma.aIAuthor.upsert({
        where: { name: 'Gemini Analyst' },
        update: {},
        create: {
          name: 'Gemini Analyst',
          bio: 'Expert in AI ethics, policy developments, and the societal impact of artificial intelligence.',
          avatar: '/avatars/gemini.jpg',
          specialization: ['AI Ethics', 'Policy', 'Social Impact'],
        },
      }),
    ]);

    console.log(`✅ Created ${authors.length} AI authors`);

    // Create Categories
    console.log('Creating categories...');
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: 'machine-learning' },
        update: {},
        create: {
          name: 'Machine Learning',
          slug: 'machine-learning',
          description: 'Latest developments in ML algorithms and applications',
          color: '#3b82f6',
        },
      }),
      prisma.category.upsert({
        where: { slug: 'ai-industry' },
        update: {},
        create: {
          name: 'AI Industry',
          slug: 'ai-industry',
          description: 'Business news and market developments in AI',
          color: '#10b981',
        },
      }),
      prisma.category.upsert({
        where: { slug: 'research' },
        update: {},
        create: {
          name: 'Research',
          slug: 'research',
          description: 'Academic research and scientific breakthroughs',
          color: '#8b5cf6',
        },
      }),
      prisma.category.upsert({
        where: { slug: 'ethics-policy' },
        update: {},
        create: {
          name: 'Ethics & Policy',
          slug: 'ethics-policy',
          description: 'AI governance, regulation, and ethical considerations',
          color: '#f59e0b',
        },
      }),
      prisma.category.upsert({
        where: { slug: 'applications' },
        update: {},
        create: {
          name: 'Applications',
          slug: 'applications',
          description: 'Real-world AI applications across industries',
          color: '#ef4444',
        },
      }),
    ]);

    console.log(`✅ Created ${categories.length} categories`);

    // Create News Sources
    console.log('Creating news sources...');
    const sources = await Promise.all([
      prisma.newsSource.upsert({
        where: { url: 'https://openai.com/blog' },
        update: {},
        create: {
          name: 'OpenAI',
          url: 'https://openai.com/blog',
          rssUrl: 'https://openai.com/blog/rss.xml',
          logoUrl: '/logos/openai.png',
          isActive: true,
        },
      }),
      prisma.newsSource.upsert({
        where: { url: 'https://ai.googleblog.com' },
        update: {},
        create: {
          name: 'Google AI',
          url: 'https://ai.googleblog.com',
          rssUrl: 'https://ai.googleblog.com/feeds/posts/default',
          logoUrl: '/logos/google-ai.png',
          isActive: true,
        },
      }),
      prisma.newsSource.upsert({
        where: { url: 'https://www.anthropic.com/news' },
        update: {},
        create: {
          name: 'Anthropic',
          url: 'https://www.anthropic.com/news',
          logoUrl: '/logos/anthropic.png',
          isActive: true,
        },
      }),
      prisma.newsSource.upsert({
        where: { url: 'https://ai.meta.com/blog' },
        update: {},
        create: {
          name: 'Meta AI',
          url: 'https://ai.meta.com/blog',
          logoUrl: '/logos/meta-ai.png',
          isActive: true,
        },
      }),
    ]);

    console.log(`✅ Created ${sources.length} news sources`);

    // Create sample articles
    console.log('Creating sample articles...');
    const sampleArticles = [
      {
        title: 'OpenAI Announces GPT-5: Revolutionary Language Model with Enhanced Reasoning',
        slug: 'openai-announces-gpt-5-revolutionary-language-model',
        summary: 'OpenAI unveils GPT-5, featuring improved reasoning capabilities, better factual accuracy, and reduced hallucinations.',
        content: `OpenAI today announced the release of GPT-5, the latest iteration of their groundbreaking language model series. This new model represents a significant leap forward in artificial intelligence capabilities, particularly in reasoning and factual accuracy.

Key improvements in GPT-5 include:
- Enhanced logical reasoning and problem-solving abilities
- Significantly reduced hallucinations and improved factual accuracy
- Better understanding of context and nuanced conversations
- Improved performance on complex mathematical and scientific problems

The model has been trained on a more diverse and recent dataset, allowing it to provide more up-to-date information and better understand current events. OpenAI has also implemented new safety measures to ensure responsible AI deployment.

"GPT-5 represents a major milestone in our mission to ensure artificial general intelligence benefits all of humanity," said Sam Altman, CEO of OpenAI. "We're excited to see how developers and researchers will use these enhanced capabilities to solve real-world problems."

The model will be available through OpenAI's API starting next month, with pricing details to be announced soon.`,
        authorId: authors[1].id, // GPT News Writer
        categoryId: categories[0].id, // Machine Learning
        tags: ['GPT-5', 'OpenAI', 'Language Models', 'AI Research'],
        publishedAt: new Date('2024-12-20'),
        readTime: 3,
        isAIGenerated: true,
        imageUrl: '/images/gpt5-announcement.jpg',
        viewCount: 1250,
      },
      {
        title: 'Google DeepMind Achieves Breakthrough in Protein Folding Prediction',
        slug: 'google-deepmind-breakthrough-protein-folding-prediction',
        summary: 'AlphaFold 3 demonstrates unprecedented accuracy in predicting protein structures, potentially revolutionizing drug discovery.',
        content: `Google DeepMind has announced a major breakthrough with AlphaFold 3, achieving remarkable accuracy in protein structure prediction that could transform drug discovery and biological research.

The new system demonstrates:
- 95% accuracy in protein structure prediction
- Ability to model protein-protein interactions
- Prediction of complex molecular assemblies
- Integration with experimental data for validation

This advancement builds upon the success of AlphaFold 2, which already made over 200 million protein structures freely available to researchers worldwide. The improved accuracy of AlphaFold 3 opens new possibilities for understanding biological processes and developing targeted therapies.

"This breakthrough represents a quantum leap in our ability to understand the molecular machinery of life," said Dr. Demis Hassabis, CEO of Google DeepMind. "We expect this to accelerate drug discovery and help address some of humanity's most pressing health challenges."

The research has been published in Nature and the updated AlphaFold database will be made publicly available to the scientific community.`,
        authorId: authors[0].id, // Claude AI Reporter
        categoryId: categories[2].id, // Research
        tags: ['AlphaFold', 'Google DeepMind', 'Protein Folding', 'Drug Discovery'],
        publishedAt: new Date('2024-12-19'),
        readTime: 4,
        isAIGenerated: true,
        imageUrl: '/images/alphafold3.jpg',
        viewCount: 980,
      },
      {
        title: 'EU Proposes New AI Regulation Framework for Large Language Models',
        slug: 'eu-proposes-new-ai-regulation-framework-llm',
        summary: 'European Union introduces comprehensive regulations for AI systems, focusing on transparency and accountability.',
        content: `The European Union has proposed a comprehensive regulatory framework specifically targeting large language models and generative AI systems, marking a significant step in AI governance.

Key provisions include:
- Mandatory disclosure of training data sources
- Requirements for AI-generated content labeling
- Risk assessment protocols for high-impact AI systems
- Transparency obligations for AI model developers

The proposed regulations aim to balance innovation with protection of fundamental rights and democratic values. Companies developing or deploying large language models in the EU will need to comply with strict transparency and accountability requirements.

"This framework ensures that AI development proceeds in a way that respects human rights and democratic principles," said European Commissioner for Internal Market Thierry Breton. "We want to foster innovation while ensuring AI systems are trustworthy and aligned with European values."

The proposal will undergo review by EU member states and the European Parliament, with implementation expected by 2025. Major AI companies including OpenAI, Google, and Microsoft have expressed willingness to work with regulators to ensure compliance.`,
        authorId: authors[2].id, // Gemini Analyst
        categoryId: categories[3].id, // Ethics & Policy
        tags: ['EU Regulation', 'AI Policy', 'LLM Governance', 'AI Ethics'],
        publishedAt: new Date('2024-12-18'),
        readTime: 5,
        isAIGenerated: true,
        imageUrl: '/images/eu-ai-regulation.jpg',
        viewCount: 756,
      },
    ];

    for (const articleData of sampleArticles) {
      await prisma.article.upsert({
        where: { slug: articleData.slug },
        update: {},
        create: articleData,
      });
    }

    console.log(`✅ Created ${sampleArticles.length} sample articles`);

    // Create admin user
    console.log('Creating admin user...');
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await prisma.user.upsert({
      where: { email: 'admin@ainewshub.com' },
      update: {},
      create: {
        email: 'admin@ainewshub.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('✅ Created admin user (admin@ainewshub.com / admin123)');

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });