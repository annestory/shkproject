import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ChevronDown, 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Menu, 
  X, 
  ExternalLink, 
  Code2, 
  Palette, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ArrowUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * [프로젝트 데이터 타입 정의]
 */
interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  detailDescription: string;
  tags: string[];
  link: string;
  featured: boolean;
}

export default function App() {
  // 모바일 메뉴 열림/닫힘 상태
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // 스크롤 위치에 따른 헤더 배경 감지
  const [isScrolled, setIsScrolled] = useState(false);
  // 프로젝트 카테고리 필터
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  // 프로젝트 상세 모달 선택
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // 문의 폼 상태
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 스크롤 이벤트 감지
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 프로젝트 데이터 리스트 (상대 경로 images/project1.jpg 형식 준수)
  const projects: Project[] = [
    {
      id: 1,
      title: "LUXE E-Commerce Interface",
      category: "WEB",
      image: "images/project1.jpg",
      description: "하이엔드 미니멀 패션 브랜드를 위한 고성능 모듈식 이커머스 웹 애플리케이션입니다.",
      detailDescription: "LUXE 프로젝트는 최첨단 미니멀 인터페이스와 직관적인 결제 프로세스를 결합한 솔루션입니다. 정교한 마이크로 애니메이션과 반응형 구조로 브랜드 가치를 고도화했습니다.",
      tags: ["React", "TypeScript", "Tailwind CSS", "Motion", "REST API"],
      link: "https://example.com/project1",
      featured: true
    },
    {
      id: 2,
      title: "FINTECH Mobile Banking System",
      category: "MOBILE",
      image: "images/project2.jpg",
      description: "복잡한 금융 데이터 흐름을 한눈에 명확하게 파악할 수 있는 자산 관리 인터페이스입니다.",
      detailDescription: "사용자 중심 경험을 극대화한 FINTECH 시스템 디자인입니다. 가독성 높은 실시간 정보 시각화와 미니멀 접근성 인터페이스로 구축되었습니다.",
      tags: ["UI/UX Design", "Figma", "React Native", "D3.js", "Prototyping"],
      link: "https://example.com/project2",
      featured: true
    },
    {
      id: 3,
      title: "AI Analytics Data Platform",
      category: "AI/UI",
      image: "images/project3.jpg",
      description: "생성형 AI 모델과 데이터 시각화를 결합하여 인사이트를 정갈하게 제시하는 플랫폼입니다.",
      detailDescription: "실시간 대용량 데이터 시각화와 Gemini API 인공지능 분석을 조합한 대시보드입니다. 클린 미니멀 화이트 모드에 최적화된 레이아웃 구조를 갖추고 있습니다.",
      tags: ["React", "Gemini API", "Tailwind CSS", "Recharts", "TypeScript"],
      link: "https://example.com/project3",
      featured: true
    }
  ];

  // 필터링된 프로젝트 목록
  const filteredProjects = activeFilter === 'ALL' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  // 문의 폼 제출 핸들러
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1000);
  };

  // 최상단 이동
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-[#1A1A1A] font-sans antialiased relative selection:bg-[#1A1A1A] selection:text-white">
      
      {/* 
        ================================================================
        [1. HEADER / NAVIGATION BAR]
        상단 고정 네비게이션 바: 로고, 메뉴 (소개, 프로젝트, 문의)
        Clean Minimalism Theme (백그라운드 #FFF, border #EDEDE9)
        ================================================================
      */}
      <header 
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#EDEDE9] py-4 shadow-sm' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* 브랜드 로고 */}
          <a 
            href="#hero" 
            id="header-logo"
            className="text-base font-bold tracking-[2px] uppercase text-[#1A1A1A] hover:opacity-70 transition-opacity flex items-center gap-2"
          >
            <span className="w-2 h-2 bg-[#1A1A1A] rounded-full inline-block"></span>
            <span>SONGHK</span>
          </a>

          {/* 데스크톱 네비게이션 메뉴 */}
          <nav id="desktop-nav" className="hidden md:flex items-center space-x-10 text-xs font-medium tracking-[1px] uppercase">
            <a 
              href="#about" 
              className="text-[#71716A] hover:text-[#1A1A1A] transition-colors duration-200"
            >
              About
            </a>
            <a 
              href="#projects" 
              className="text-[#71716A] hover:text-[#1A1A1A] transition-colors duration-200"
            >
              Projects
            </a>
            <a 
              href="#contact" 
              className="text-[#71716A] hover:text-[#1A1A1A] transition-colors duration-200"
            >
              Contact
            </a>
          </nav>

          {/* 우측 CTA 버튼 */}
          <div className="hidden md:flex items-center">
            <a 
              href="#contact" 
              className="text-[11px] font-medium uppercase tracking-[1px] bg-[#1A1A1A] text-white px-5 py-2.5 rounded-none hover:bg-neutral-800 transition-all duration-200"
            >
              Work With Me
            </a>
          </div>

          {/* 모바일 햄버거 토글 버튼 */}
          <button 
            id="mobile-menu-button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#1A1A1A] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* 모바일 내비게이션 드롭다운 */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#FFF] border-b border-[#EDEDE9] px-6 py-6 space-y-4"
            >
              <nav className="flex flex-col space-y-4 text-sm font-medium uppercase tracking-wider">
                <a 
                  href="#about" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#1A1A1A] py-2 border-b border-[#EDEDE9] flex justify-between items-center"
                >
                  <span>About</span>
                </a>
                <a 
                  href="#projects" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#1A1A1A] py-2 border-b border-[#EDEDE9] flex justify-between items-center"
                >
                  <span>Projects</span>
                </a>
                <a 
                  href="#contact" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#1A1A1A] py-2 border-b border-[#EDEDE9] flex justify-between items-center"
                >
                  <span>Contact</span>
                </a>
              </nav>
              <div className="pt-2">
                <a 
                  href="#contact" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center text-xs font-medium uppercase tracking-widest bg-[#1A1A1A] text-white py-3"
                >
                  프로젝트 문의하기
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>


      {/* 
        ================================================================
        [2. HERO SECTION]
        Clean Minimalism 스타일의 패럴렉스 스크롤 배경 및 히어로 레이아웃 (background-attachment: fixed)
        ================================================================
      */}
      <section 
        id="hero" 
        className="parallax-hero-section pt-24 pb-16"
      >
        {/* 라이트 오버레이 패럴렉스 배경 */}
        <div className="parallax-bg"></div>
        <div className="parallax-overlay"></div>

        {/* Hero 콘텐츠 */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#FFF] border border-[#EDEDE9] text-[11px] font-mono uppercase tracking-[2px] text-[#71716A] mb-8 shadow-xs"
          >
            <Sparkles className="w-3 h-3 text-[#2563EB]" />
            <span>Creative Frontend Architect & UI Designer</span>
          </motion.div>

          {/* 메인 타이포그래피 헤드라인 */}
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-[-1.5px] text-[#1A1A1A] leading-[1.05] mb-8"
          >
            CLEAN UI. <br className="hidden sm:block" />
            <span className="font-light text-[#71716A]">HIGH-PERFORMANCE</span> <br className="hidden sm:block" />
            EXPERIENCE.
          </motion.h1>

          {/* 서브 설명 글 */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto text-sm sm:text-base text-[#71716A] font-normal leading-relaxed mb-10"
          >
            절제된 아름다움과 정교한 라이트 모노크롬 미학. 
            사용자 경험의 본질에 집중한 웹 포트폴리오를 설계합니다.
          </motion.p>

          {/* 주요 작업 버튼 */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a 
              href="#projects" 
              className="w-full sm:w-auto px-8 py-3.5 bg-[#1A1A1A] text-white font-medium text-xs tracking-[1.5px] uppercase hover:bg-neutral-800 transition-all duration-200 flex items-center justify-center gap-2 group shadow-sm"
            >
              <span>Explore Projects</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <a 
              href="#about" 
              className="w-full sm:w-auto px-8 py-3.5 bg-[#FFF] border border-[#EDEDE9] text-[#1A1A1A] hover:bg-[#F5F5F2] font-medium text-xs tracking-[1.5px] uppercase transition-all duration-200"
            >
              Read About
            </a>
          </motion.div>

        </div>

        {/* 하단 스크롤 가이드 */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 text-[#71716A] animate-bounce">
          <a href="#about" aria-label="Scroll to About Section">
            <ChevronDown className="w-5 h-5" />
          </a>
        </div>
      </section>


      {/* 
        ================================================================
        [3. ABOUT (소개) SECTION]
        프로필 이미지(images/profile.jpg), 자기소개 글, 핵심 역량 태그
        Clean Minimalism Sidebar & Profile Box 패턴 적용
        ================================================================
      */}
      <section id="about" className="py-24 md:py-32 bg-[#FDFDFB] relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* 섹션 타이틀 */}
          <div className="mb-14">
            <span className="text-[11px] font-mono tracking-[2px] uppercase text-[#B5B5B0] block mb-2">01 // ABOUT ME</span>
            <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#1A1A1A]">
              소개 및 프로필
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* 왼쪽: 프로필 프레임 & 기본 정보 카드 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5"
            >
              <div className="bg-[#FFF] border border-[#EDEDE9] p-6 shadow-sm space-y-6">
                <div className="aspect-square w-full bg-[#F5F5F2] border border-[#EDEDE9] overflow-hidden">
                  <img 
                    src="images/profile.jpg" 
                    alt="Song Ho-kyung Profile" 
                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="border-t border-[#EDEDE9] pt-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">송호경 (SONG HK)</h3>
                    <p className="text-xs text-[#71716A] font-mono">Senior Developer & UI Designer</p>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-mono uppercase bg-[#FAF9F6] border border-[#EDEDE9] text-[#71716A]">
                    Available
                  </span>
                </div>
              </div>
            </motion.div>

            {/* 오른쪽: 자기소개 글 & 역량 서술 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-8"
            >
              <div>
                <h3 className="text-2xl sm:text-3xl font-normal text-[#1A1A1A] leading-snug mb-6">
                  미니멀 미학(Minimal Aesthetics)과 <br />
                  <span className="text-[#71716A]">고성능 인터랙션</span>의 균형을 완성합니다.
                </h3>
                
                <p className="text-[#71716A] font-normal leading-relaxed text-sm sm:text-base mb-4">
                  안녕하세요! 사용자가 서비스와 만나는 접점을 직관적이고 군더더기 없이 정제해내는 
                  프론트엔드 아키텍트이자 UI/UX 디자이너 **송호경 (SONG HK)** 입니다.
                </p>
                <p className="text-[#71716A] font-normal leading-relaxed text-xs sm:text-sm">
                  단순함(Simplicity)은 불필요한 요소를 제거하는 것에 그치지 않고, 복잡한 비즈니스 데이터와 
                  사용자 경험을 가장 신뢰감 있게 전달하는 가장 강력한 디자인 언어입니다.
                </p>
              </div>

              {/* 핵심 카드 2개 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-6 bg-[#FFF] border border-[#EDEDE9]">
                  <Palette className="w-5 h-5 text-[#1A1A1A] mb-3" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">UI/UX Architecture</h4>
                  <p className="text-xs text-[#71716A] leading-relaxed">
                    Figma 기반 라이트 미니멀 디자인 시스템 구축, 모듈식 컴포넌트 라이브러리 설계.
                  </p>
                </div>

                <div className="p-6 bg-[#FFF] border border-[#EDEDE9]">
                  <Code2 className="w-5 h-5 text-[#1A1A1A] mb-3" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">Frontend Engineering</h4>
                  <p className="text-xs text-[#71716A] leading-relaxed">
                    React, TypeScript, Tailwind CSS 스택 중심의 최적화된 웹 애플리케이션 개발.
                  </p>
                </div>
              </div>

              {/* 기술 태그 리스트 */}
              <div className="pt-2">
                <span className="text-[11px] font-mono tracking-[1.5px] uppercase text-[#B5B5B0] block mb-3">
                  TECH STACK & TAGS
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "React", "TypeScript", "Tailwind CSS", "Next.js", 
                    "UI/UX Design", "Figma", "Web Performance", "Motion", 
                    "REST API", "Git"
                  ].map((skill, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-[#F5F5F2] border border-[#EDEDE9] text-[10px] font-mono text-[#71716A] uppercase"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </motion.div>

          </div>

        </div>
      </section>


      {/* 
        ================================================================
        [4. PROJECTS (프로젝트) SECTION]
        3개의 카드 프로젝트 그리드 (images/project1.jpg, project2.jpg, project3.jpg)
        Clean Minimalism 카드 매핑
        ================================================================
      */}
      <section id="projects" className="py-24 md:py-32 bg-[#FAF9F6] border-t border-b border-[#EDEDE9]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* 섹션 타이틀 및 필터 */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-[11px] font-mono tracking-[2px] uppercase text-[#B5B5B0] block mb-2">02 // FEATURED WORKS</span>
              <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#1A1A1A]">
                주요 프로젝트
              </h2>
            </div>

            {/* 필터버튼 */}
            <div className="flex flex-wrap gap-2">
              {['ALL', 'WEB', 'MOBILE', 'AI/UI'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-[1px] transition-all duration-200 border ${
                    activeFilter === filter
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-[#FFF] text-[#71716A] border-[#EDEDE9] hover:border-[#B5B5B0]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* 프로젝트 그리드 카드 (3개) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.article 
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  key={project.id}
                  className="project-card group"
                >
                  <div>
                    {/* 프로젝트 썸네일 */}
                    <div className="project-thumb-box">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-3 left-3 bg-[#FFF] border border-[#EDEDE9] px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-wider text-[#71716A] z-10 shadow-2xs">
                        {project.category}
                      </span>
                    </div>

                    {/* 카피 내용 */}
                    <h3 className="text-base font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#2563EB] transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#71716A] font-normal leading-relaxed mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* 태그 */}
                    <div className="flex flex-wrap gap-1 mb-6">
                      {project.tags.map((tag, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-0.5 bg-[#F5F5F2] text-[10px] font-mono text-[#71716A] uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 하단 링크 버튼 */}
                  <div className="border-t border-[#EDEDE9] pt-4 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="text-[11px] font-medium uppercase tracking-[1px] text-[#1A1A1A] hover:text-[#2563EB] transition-colors flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    
                    <a 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1A1A1A] hover:text-[#2563EB] transition-colors"
                      aria-label="View Project External Link"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>

                </motion.article>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </section>


      {/* 
        ================================================================
        [프로젝트 상세 정보 모달 (Clean Minimalism)]
        ================================================================
      */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            ></motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-full max-w-2xl bg-[#FFF] border border-[#EDEDE9] shadow-xl z-10 max-h-[90vh] flex flex-col p-6 sm:p-8"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 text-[#71716A] hover:text-[#1A1A1A]"
              >
                <X size={18} />
              </button>

              <div className="overflow-y-auto pr-1">
                <div className="aspect-video bg-[#F5F5F2] border border-[#EDEDE9] overflow-hidden mb-6">
                  <img 
                    src={selectedProject.image} 
                    alt={selectedProject.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <span className="text-[10px] font-mono uppercase bg-[#F5F5F2] text-[#71716A] px-2.5 py-1 mb-2 inline-block">
                  {selectedProject.category}
                </span>

                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3">
                  {selectedProject.title}
                </h3>

                <p className="text-[#71716A] text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  {selectedProject.detailDescription}
                </p>

                <div className="mb-6">
                  <span className="text-[10px] font-mono text-[#B5B5B0] uppercase block mb-2">USED TECH STACK</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.tags.map((tag, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-[#F5F5F2] text-[10px] font-mono text-[#71716A] uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-[#EDEDE9] pt-5">
                  <a 
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-[#1A1A1A] text-white font-medium text-xs uppercase tracking-[1px] hover:bg-neutral-800 transition-colors flex items-center gap-2"
                  >
                    <span>Visit Live Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="px-5 py-2.5 bg-[#F5F5F2] text-[#1A1A1A] font-medium text-xs uppercase tracking-[1px] hover:bg-[#EDEDE9] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* 
        ================================================================
        [5. CONTACT (문의) SECTION]
        Clean Minimalism 포맷: 밑줄 인풋 스타일 (border-bottom: 1px solid #EDEDE9)
        ================================================================
      */}
      <section id="contact" className="py-24 md:py-32 bg-[#FDFDFB]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="mb-14">
            <span className="text-[11px] font-mono tracking-[2px] uppercase text-[#B5B5B0] block mb-2">03 // INQUIRY & CONNECT</span>
            <h2 className="text-2xl sm:text-3xl font-normal font-['Plus_Jakarta_Sans',sans-serif] tracking-tighter text-[#1A1A1A]">
              Contact & Inquiry
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* 왼쪽 정보 리스트 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 space-y-8"
            >
              <div>
                <h3 className="text-3xl font-normal text-[#1A1A1A] leading-snug mb-4">
                  프로젝트 제안이나 <br />
                  <span className="text-[#71716A]">협업 메시지</span>를 남겨주세요.
                </h3>
                <p className="text-[#71716A] text-xs sm:text-sm font-normal leading-relaxed">
                  새로운 웹 서비스 구축, 인터페이스 디자인 고도화, 또는 기술 협업 문의 등 
                  언제든 메시지를 전달해 주시면 친절하게 답변드리겠습니다.
                </p>
              </div>

              {/* 연결 정보 목록 */}
              <div className="space-y-4 pt-2 border-t border-[#EDEDE9]">
                <div className="flex items-center gap-4 py-2">
                  <Mail className="w-4 h-4 text-[#1A1A1A]" />
                  <div>
                    <span className="text-[10px] font-mono text-[#B5B5B0] uppercase block">EMAIL</span>
                    <a href="mailto:songhk.creator@gmail.com" className="text-xs font-medium text-[#1A1A1A] hover:underline">
                      songhk.creator@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-2">
                  <Phone className="w-4 h-4 text-[#1A1A1A]" />
                  <div>
                    <span className="text-[10px] font-mono text-[#B5B5B0] uppercase block">PHONE</span>
                    <a href="tel:+821089001234" className="text-xs font-medium text-[#1A1A1A] hover:underline">
                      +82 (0)10-8900-1234
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-2">
                  <MapPin className="w-4 h-4 text-[#1A1A1A]" />
                  <div>
                    <span className="text-[10px] font-mono text-[#B5B5B0] uppercase block">LOCATION</span>
                    <span className="text-xs font-medium text-[#1A1A1A]">
                      Seoul, South Korea
                    </span>
                  </div>
                </div>
              </div>

              {/* 소셜 링크 */}
              <div className="pt-2">
                <span className="text-[10px] font-mono text-[#B5B5B0] uppercase tracking-wider block mb-3">
                  SOCIAL LINKS
                </span>
                <div className="flex items-center gap-4 text-xs font-mono text-[#71716A]">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1A1A1A]">GitHub</a>
                  <span>/</span>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1A1A1A]">LinkedIn</a>
                </div>
              </div>

            </motion.div>

            {/* 오른쪽: 밑줄 스타일 문의 폼 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-7 bg-[#FFF] p-8 border border-[#EDEDE9]"
            >
              <h3 className="text-base font-bold uppercase tracking-wider text-[#1A1A1A] mb-8">Send a Message</h3>

              {isSubmitted ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-[#1A1A1A] mx-auto" />
                  <h4 className="text-base font-bold text-[#1A1A1A]">메시지가 정상적으로 발송되었습니다.</h4>
                  <p className="text-xs text-[#71716A]">
                    전송해주신 문의 내용을 확인한 후 회신해 드리겠습니다. 감사합니다.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitForm} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-[10px] font-mono uppercase text-[#71716A] mb-1">
                      Name *
                    </label>
                    <input 
                      type="text" 
                      id="name"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="성함을 입력하세요"
                      className="w-full py-2 bg-transparent border-b border-[#EDEDE9] text-[#1A1A1A] placeholder-[#B5B5B0] focus:outline-none focus:border-[#1A1A1A] text-xs transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-[10px] font-mono uppercase text-[#71716A] mb-1">
                      Email *
                    </label>
                    <input 
                      type="email" 
                      id="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="이메일 주소를 입력하세요"
                      className="w-full py-2 bg-transparent border-b border-[#EDEDE9] text-[#1A1A1A] placeholder-[#B5B5B0] focus:outline-none focus:border-[#1A1A1A] text-xs transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-[10px] font-mono uppercase text-[#71716A] mb-1">
                      Message *
                    </label>
                    <textarea 
                      id="message"
                      rows={4}
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="프로젝트 일정, 세부 요구사항 등을 작성해 주세요."
                      className="w-full py-2 bg-transparent border-b border-[#EDEDE9] text-[#1A1A1A] placeholder-[#B5B5B0] focus:outline-none focus:border-[#1A1A1A] text-xs transition-colors resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#1A1A1A] text-white border-none px-6 py-3 text-[11px] font-medium uppercase tracking-[1px] cursor-pointer hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 mt-4"
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}

            </motion.div>

          </div>

        </div>
      </section>


      {/* 
        ================================================================
        [6. FOOTER]
        Clean Minimalism 풋터 (height: 40px 영역 감성의 정갈한 패널)
        ================================================================
      */}
      <footer className="py-6 bg-[#FFF] border-t border-[#EDEDE9] text-[10px] font-mono text-[#B5B5B0] uppercase tracking-[1px]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div>
            &copy; 2026 SONGHK PORTFOLIO. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-6">
            <span>SEOUL, SOUTH KOREA</span>
            <button 
              onClick={scrollToTop}
              className="text-[#1A1A1A] hover:opacity-50 transition-opacity"
              aria-label="Scroll to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </footer>

    </div>
  );
}
