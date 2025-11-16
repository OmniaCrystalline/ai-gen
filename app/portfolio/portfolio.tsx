import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card, Button } from "@radix-ui/themes";
import { Link } from "react-router";
import { FaGithub, FaMailBulk, FaLinkedin, FaGlobe, FaSave } from "react-icons/fa";



type Repo = {
  id: number;
  name: string;
  description: string;
  language: string;
  html_url: string;
  homepage: string;
  topics: string[];
  created_at?: string;
  updated_at?: string;
};

function Portfolio() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [filter, setFilter] = useState("");
  const [sortType, setSortType] = useState<keyof Repo>("updated_at");
  const [languageFilter, setLanguageFilter] = useState("");

  useEffect(() => {
    // Завантажуємо всі репозиторії з пагінацією
    const fetchAllRepos = async () => {
      try {
        let allRepos: Repo[] = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const response = await fetch(
            `https://api.github.com/users/OmniaCrystalline/repos?per_page=100&page=${page}&sort=updated`
          );
          const data = await response.json();

          if (data.length === 0) {
            hasMore = false;
          } else {
            allRepos = [...allRepos, ...data];
            page++;
            // GitHub API повертає максимум 100 репозиторіїв на сторінку
            if (data.length < 100) {
              hasMore = false;
            }
          }
        }

        setRepos(allRepos);
      } catch (error) {
        console.error("Error fetching repos:", error);
      }
    };

    fetchAllRepos();
  }, []);


  const filteredRepos = repos
    .filter(repo => {
      // Показуємо тільки репозиторії з homepage (перевіряємо наявність та що це не порожній рядок)
      if (!repo.homepage || repo.homepage.trim() === "") return false;

      const matchesFilter = filter === "" ||
        repo.name.toLowerCase().includes(filter.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(filter.toLowerCase())) ||
        repo.topics.some(topic => topic.toLowerCase().includes(filter.toLowerCase()));
      const matchesLanguage = languageFilter === "" || repo.language === languageFilter;
      return matchesFilter && matchesLanguage;
    })
    .sort((a, b) => {
      const aValue = a[sortType];
      const bValue = b[sortType];

      // Сортування за датами (updated_at, created_at)
      if (sortType === 'updated_at' || sortType === 'created_at') {
        const aDate = aValue ? new Date(aValue as string).getTime() : 0;
        const bDate = bValue ? new Date(bValue as string).getTime() : 0;
        return bDate - aDate; // Спочатку новіші
      }

      // Сортування за рядками (name)
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      }

      return 0;
    });

  const languages = [...new Set(repos.map(repo => repo.language).filter(Boolean))];

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-8 sm:space-y-10 lg:space-y-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <header className="text-center space-y-3 sm:space-y-4">
        <motion.h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Vira Mospan
        </motion.h1>
        <motion.p
          className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Full-Stack Developer | Open Source Contributor
        </motion.p>
      </header>

      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">
          About Me
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Passionate full-stack developer with experience in building scalable web applications.
          I love solving complex problems, contributing to open-source projects, and constantly learning
          new technologies. My expertise includes React, Node.js, database management, and AI/ML integration.
          Let's build something amazing together!
        </p>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">
          Skills
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Hard Skills</h3>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
              <li>JavaScript (ES6+), TypeScript</li>
              <li>React, Next.js</li>
              <li>Node.js, Express</li>
              <li>RESTful APIs, GraphQL</li>
              <li>SQL (PostgreSQL, MySQL), NoSQL (MongoDB)</li>
              <li>AI/ML Integration, OpenAI API</li>
              <li>Version Control (Git, GitHub)</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Soft Skills</h3>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
              <li>Problem-solving</li>
              <li>Team collaboration</li>
              <li>Effective communication</li>
              <li>Time management</li>
              <li>Adaptability</li>
              <li>Continuous learning</li>
            </ul>
          </div>
        </div>
      </section>


      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">
          Projects
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <input
            type="text"
            placeholder="Пошук за назвою, описом або тегами..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 sm:py-3 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <select
            className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 sm:py-3 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={sortType}
            onChange={(e) => setSortType(e.target.value as keyof Repo)}
          >
            <option value="updated_at">Sort by Updated Date</option>
            <option value="name">Sort by Name</option>
            <option value="created_at">Sort by Created Date</option>
          </select>
          <select
            className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 sm:py-3 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
          >
            <option value="">Filter by Language</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
          {filteredRepos.length === 0 ? (
            <p className="col-span-full text-center text-gray-600 dark:text-gray-400 py-8 text-sm sm:text-base">
              Немає репозиторіїв, що відповідають фільтрам
            </p>
          ) : (
            filteredRepos.map((repo) => (
              <motion.div
                key={repo.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="h-full"
              >
                <Card className="p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col bg-white dark:bg-gray-700">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                    {repo.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 grow">
                    {repo.description || "No description available"}
                  </p>
                  <div className="space-y-2 sm:space-y-3 mt-auto">
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                    >
                      <FaGlobe className="w-4 h-4 shrink-0" />
                      <span className="truncate">view homepage</span>
                    </a>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      <FaSave className="w-4 h-4 shrink-0" />
                      <span className="truncate">view on GitHub</span>
                    </a>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Language: {repo.language || "Unknown"}
                    </p>
                    {repo.topics && repo.topics.length > 0 && (
                      <ul className="flex flex-wrap gap-2 mt-2">
                        {repo.topics.map(e => (
                          <li
                            key={e}
                            className="text-xs sm:text-sm bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
                          >
                            {e}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">
          Experience
        </h2>
        <div className="space-y-4 sm:space-y-6">
          <div className="border-l-4 border-blue-500 pl-4 sm:pl-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              Frontend Developer
            </h3>
            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 italic">"NDA"</span>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
              Frontend development, React, TypeScript
            </p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4 sm:pl-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              Сommodity Expert
            </h3>
            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 italic">"Foxtrot"</span>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
              Inventory, receipt of goods
            </p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4 sm:pl-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              Loan Manager
            </h3>
            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 italic">"Blago/Scarbnitsa"</span>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
              Sales, Marketing, and Customer Service
            </p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4 sm:pl-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              Assistant Accountant
            </h3>
            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 italic">"EL-House"</span>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
              Inventory, Accounts Payable, and Accounts Receivable
            </p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4 sm:pl-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              Frontend Developer
            </h3>
            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 italic">"freelance"</span>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
              Layout of sites
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <a
            href="https://github.com/OmniaCrystalline"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <FaGithub className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base">GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/vera-mospan/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <FaLinkedin className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base">LinkedIn</span>
          </a>
          <a
            href="mailto:vp.mospan@gmail.com"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <FaMailBulk className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base">Email</span>
          </a>
        </div>
      </footer>
    </motion.div>
  );
}


export default Portfolio