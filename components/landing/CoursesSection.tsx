import { ArrowRight, TrendingUp } from "lucide-react"

const courses = [
  {
    title: "Java Full Stack Development",
    salary: "₹6L – ₹15L",
    tags: ["Spring Boot", "React", "MySQL", "REST APIs"],
    popular: true,
    desc: "Master Java backend with Spring Boot + React frontend. Industry's most in-demand full stack skill.",
  },
  {
    title: "Python Full Stack Development",
    salary: "₹5L – ₹12L",
    tags: ["Django", "Flask", "React", "PostgreSQL"],
    popular: false,
    desc: "Build scalable web apps with Python's powerful frameworks and modern JavaScript frontend.",
  },
  {
    title: "Dotnet Full Stack Development",
    salary: "₹6L – ₹14L",
    tags: ["ASP.NET Core", "C#", "Angular", "SQL Server"],
    popular: false,
    desc: "Microsoft stack expertise for enterprise-grade application development.",
  },
  {
    title: "Data Engineering",
    salary: "₹8L – ₹20L",
    tags: ["Apache Spark", "Kafka", "AWS", "Python"],
    popular: false,
    desc: "Build robust data pipelines and work with big data technologies at scale.",
  },
  {
    title: "IT Production Support",
    salary: "₹4L – ₹10L",
    tags: ["Linux", "Shell Script", "Monitoring", "ITIL"],
    popular: false,
    desc: "Kickstart your IT career with L1/L2 support roles and system administration skills.",
  },
  {
    title: "DevOps / AWS",
    salary: "₹8L – ₹18L",
    tags: ["Docker", "Kubernetes", "Jenkins", "Terraform"],
    popular: false,
    desc: "Master cloud infrastructure and modern DevOps practices for high-growth careers.",
  },
]

export default function CoursesSection() {
  return (
    <section id="courses" className="py-20 bg-black relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-red-500 text-sm font-semibold uppercase tracking-widest">Our Programs</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-3 text-balance">
            Job-Oriented <span className="text-gradient-red">IT Courses</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-sm">
            Industry-aligned curriculum designed with inputs from 180+ hiring partners.
            All courses include placement assistance.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <div
              key={course.title}
              className={`relative glass-card rounded-2xl p-6 border transition-all hover:-translate-y-1 group ${
                course.popular
                  ? "border-red-600/60 red-glow"
                  : "border-white/10 hover:border-red-600/40"
              }`}
            >
              {course.popular && (
                <div className="absolute -top-3 left-4">
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-white font-bold text-lg mb-2 leading-tight group-hover:text-red-400 transition-colors">
                {course.title}
              </h3>
              <p className="text-white/50 text-xs leading-relaxed mb-4">{course.desc}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-white/5 border border-white/10 text-white/60 text-xs px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Salary */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-red-500" />
                  <span className="text-white font-bold text-sm">{course.salary}</span>
                  <span className="text-white/40 text-xs">/ year</span>
                </div>
                <a
                  href="#contact"
                  className="flex items-center gap-1 text-red-500 hover:text-red-400 text-xs font-semibold transition-colors"
                >
                  Enroll <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl transition-all red-glow hover:scale-105"
          >
            View Course Details & Fees
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
