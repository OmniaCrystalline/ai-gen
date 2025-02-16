import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card, Button } from "@radix-ui/themes";
import { Link } from "react-router";
import { FaGithub, FaMailBulk, FaLinkedin, FaGlobe, FaSave } from "react-icons/fa";



function Portfolio() {
  const [repos, setRepos] = useState<Array<{ id: number; name: string; description: string; language: string; html_url: string, homepage: string, topics: string[] }>>([]);
  const [filter, setFilter] = useState("");
  const [sortType, setSortType] = useState<keyof typeof repos[0]>("name");
  const [languageFilter, setLanguageFilter] = useState("");

  useEffect(() => {
    fetch("https://api.github.com/users/OmniaCrystalline/repos")
      .then((res) => res.json())
      .then((data) => setRepos(data))
      .catch((error) => console.error("Error fetching repos:", error));
  }, []);

  const filteredRepos = repos
    .filter(repo =>
      repo.topics.toString().toLowerCase().includes(filter.toLowerCase()) &&
      (languageFilter === "" || repo.language === languageFilter)
    )
    .sort((a, b) => {
      if (typeof a[sortType] === 'string' && typeof b[sortType] === 'string') {
        return a[sortType].localeCompare(b[sortType]);
      }
      return 0;
    });

  const languages = [...new Set(repos.map(repo => repo.language).filter(Boolean))];

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <header className="text-center">
        <motion.h1
          className="text-4xl font-bold"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Vira Mospan
        </motion.h1>
        <motion.p
          className="text-lg text-gray-600"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Full-Stack Developer | Open Source Contributor
        </motion.p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-4">About Me</h2>
        <p className="text-gray-600">
          Passionate full-stack developer with experience in building scalable web applications.
          I love solving complex problems, contributing to open-source projects, and constantly learning
          new technologies. My expertise includes React, Node.js, and database management.
          Let's build something amazing together!
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Skills</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold">Hard Skills</h3>
            <ul className="list-disc ml-5 text-gray-600">
              <li>JavaScript (ES6+), TypeScript</li>
              <li>React, Next.js</li>
              <li>Node.js, Express</li>
              <li>RESTful APIs, GraphQL</li>
              <li>SQL (PostgreSQL, MySQL), NoSQL (MongoDB)</li>
              <li>Version Control (Git, GitHub)</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Soft Skills</h3>
            <ul className="list-disc ml-5 text-gray-600">
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


      <section>
        <h2 className="text-2xl font-semibold mb-4">Projects</h2>
        <div className="flex gap-5">
          <input
            type="text"
            placeholder="Search projects by topics..."
            className="border p-2 w-full mb-4"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <select
            className="border p-2 mb-4"
            value={sortType}
            onChange={(e) => setSortType(e.target.value as keyof typeof repos[0])}
          >
            <option value="name">Sort by Name</option>
            <option value="created_at">Sort by Date</option>
          </select>
          <select
            className="border p-2 mb-4"
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
          >
            <option value="">Filter by Language</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}

          </select>
        </div>

        {/*examples*/}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredRepos.map((repo) => (
            repo.homepage && (
              <motion.div
                key={repo.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-4 border border-gray-200">
                  <h3 className="text-xl font-semibold">{repo.name}</h3>
                  <p className="text-gray-600">{repo.description || "No description available"}</p>
                  <p className="flex text-gray-600 gap-1 place-items-center"><FaGlobe /><Link className="text-gray-600 italic" to={repo.homepage} target="_blank">veiw homepage</Link></p>
                  <p className="flex shrink-0 text-gray-600 gap-1 place-items-center"><FaSave /><Link className="text-gray-600 italic flex flex-wrap" to={repo.html_url} target="_blank">veiw on GitHub</Link></p>
                  <p className="text-sm text-gray-500 gap-1">Language: {repo.language || "Unknown"}</p>
                  <ul className="flex gap-4">{repo.topics.map(e => <li key={e}>{e}</li>)}</ul>
                </Card>
              </motion.div>
            )
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Experience</h2>
        <div className="flex gap-5">
          <ul>
            <li>
              <h3 className="text-lg font-semibold">Сommodity Expert</h3>
              <span className="text-sm text-gray-600 italic">"Foxtrot"</span>
              <p className="text-gray-600">Inventory, receipt of goods</p>
            </li>
            <li>
              <h3 className="text-lg font-semibold">Loan Manager</h3>
              <span className="text-sm text-gray-600 italic">"Blago/Scarbnitsa"</span>
              <p className="text-gray-600">Sales, Marketing, and Customer Service</p>
            </li>
            <li>
              <h3 className="text-lg font-semibold">Assistant Accountant</h3>
              <span className="text-sm text-gray-600 italic">"EL-House"</span>
              <p className="text-gray-600">Inventory, Accounts Payable, and Accounts Receivable</p>
            </li>
            <li>
              <h3 className="text-lg font-semibold">Frontend Developer</h3>
              <span className="text-sm text-gray-600 italic">"freelance"</span>
              <p className="text-gray-600">Layout of sites</p>
            </li>
          </ul>
        </div>
      </section>

      <footer className="text-center space-x-4 flex justify-evenly">
        <Button variant="ghost" asChild>
          <a href="https://github.com/OmniaCrystalline" target="_blank"><FaGithub className="w-5 h-5" /></a>
        </Button>
        <Button variant="ghost" asChild>
          <a href="https://www.linkedin.com/in/vera-mospan/" target="_blank"><FaLinkedin className="w-5 h-5" /></a>
        </Button>
        <Button variant="ghost" asChild>
          <a href="mailto:vp.mospan@gmail.com"><FaMailBulk className="w-5 h-5" /></a>
        </Button>
      </footer>
    </motion.div>
  );
}


export default Portfolio