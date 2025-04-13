
import React, { createContext, useContext, useState, useEffect } from "react";

type LanguageType = "english" | "spanish";

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
  translations: Record<string, Record<string, string>>;
  t: (key: string, params?: Record<string, string>) => string;
}

const translations = {
  english: {
    // Navbar
    "nav.about": "About",
    "nav.features": "Features",
    "nav.contact": "Contact",
    "nav.register": "Register",
    "nav.login": "Login",
    
    // Hero
    "hero.title": "Build Your Future in Construction",
    "hero.subtitle": "The fastest way to find work or hire skilled contractors in your area. Join thousands of professionals making connections every day.",
    "hero.language": "Language:",
    "hero.needWork": "I Need Work",
    "hero.needHire": "I Need to Hire",
    
    // Home Page
    "home.whyChoose": "Why Choose QuickHireCrew?",
    "home.connectTitle": "Connect with Top Companies",
    "home.connectDesc": "Access opportunities with leading construction firms in your area",
    "home.skilledTitle": "Skilled Workforce",
    "home.skilledDesc": "Find qualified contractors for your construction projects",
    "home.quickTitle": "Quick Hiring",
    "home.quickDesc": "Streamlined process to get workers on site faster",
    "home.verifiedTitle": "Verified Profiles",
    "home.verifiedDesc": "All contractors and companies are thoroughly vetted",
    "home.testimonials": "What Our Users Say",
    "home.readyToStart": "Ready to Get Started?",
    "home.joinThousands": "Join thousands of construction professionals already using QuickHireCrew",
    "home.signUpNow": "Sign Up Now",
    "home.activeUsers": "Active Users",
    "home.successRate": "Success Rate",
    "home.userRating": "User Rating",
    
    // Dashboard
    "dashboard.welcomeBack": "Welcome back, {name}!",
    "dashboard.jobSearchProgress": "Here's your job search progress overview",
    "dashboard.findJobs": "Find Jobs",
    "dashboard.myProfile": "My Profile",
    "dashboard.totalApplications": "Total Applications",
    "dashboard.jobsApplied": "Jobs you've applied to",
    "dashboard.acceptedJobs": "Accepted Jobs",
    "dashboard.successfullyLanded": "Successfully landed positions",
    "dashboard.weeklyEarning": "Weekly Earning Potential",
    "dashboard.basedOn40hr": "Based on 40hr work week",
    "dashboard.matchScore": "Match Score",
    "dashboard.acceptanceRate": "Job acceptance rate",
    "dashboard.activeApplications": "Active Applications",
    "dashboard.availableJobs": "Available Jobs",
    "dashboard.recentActivity": "Recent Activity",
    
    // Dashboard Sidebar
    "dashboard.sidebar.dashboard": "Dashboard",
    "dashboard.sidebar.messages": "Messages",
    "dashboard.sidebar.profile": "Profile",
    "dashboard.sidebar.availableJobs": "Available Jobs",
    "dashboard.sidebar.payments": "Payments",
    "dashboard.sidebar.settings": "Settings",
    
    // About Page
    "about.title": "About Quick Hire Crew",
    "about.subtitle": "Connecting construction companies with skilled temporary workers",
    "about.mission": "Our Mission",
    "about.missionText": "To revolutionize temporary staffing in construction by creating seamless connections between skilled workers and companies, ensuring projects stay on schedule and workers find meaningful opportunities.",
    "about.vision": "Our Vision",
    "about.visionText": "To become the leading platform for construction workforce management, making it easier than ever to find and manage temporary skilled labor.",
    "about.companies": "Companies",
    "about.workers": "Workers",
    "about.jobsCompleted": "Jobs Completed",
    "about.successRate": "Success Rate",
    "about.howItWorks": "How It Works",
    "about.howItWorksText": "Quick Hire Crew provides a streamlined platform where construction companies can quickly find and hire temporary workers based on their specific needs. Our matching system considers skills, experience, and availability to ensure the perfect fit.",
    "about.whyChooseUs": "Why Choose Us",
    "about.quickMatching": "Quick and efficient matching process",
    "about.verifiedWorkers": "Verified skilled workers",
    "about.securePayment": "Secure payment system",
    "about.realTimeCommunication": "Real-time communication",
    "about.ratingSystem": "Rating and review system",
    "about.joinToday": "Join Quick Hire Crew Today",
    
    // Features Page
    "features.title": "Quick Hire Crew Features",
    "features.subtitle": "Everything you need to manage temporary construction workforce",
    "features.smartMatching": "Smart Matching",
    "features.smartMatchingDesc": "Advanced algorithm to match workers with the right jobs based on skills and experience.",
    "features.smartMatchingAdd": "Our AI-powered matching system considers location, skills, experience, and availability to ensure the perfect fit for every job.",
    "features.messaging": "Instant Messaging",
    "features.messagingDesc": "Real-time communication between companies and workers for better coordination.",
    "features.messagingAdd": "Built-in chat system with read receipts, file sharing, and automatic notifications to keep everyone in sync.",
    "features.payments": "Secure Payments",
    "features.paymentsDesc": "Safe and reliable payment processing for all completed work.",
    "features.paymentsAdd": "Protected by industry-standard encryption with automated invoicing and payment tracking.",
    "features.profiles": "Verified Profiles",
    "features.profilesDesc": "All workers and companies are verified for safety and reliability.",
    "features.profilesAdd": "Multi-step verification process including document checks and reference verification for peace of mind.",
    "features.quickHiring": "Quick Hiring",
    "features.quickHiringDesc": "Streamlined process to hire temporary workers within hours.",
    "features.quickHiringAdd": "Reduce hiring time from weeks to hours with our optimized workflows and instant matching.",
    "features.teamManagement": "Team Management",
    "features.teamManagementDesc": "Easy tools to manage multiple workers and projects.",
    "features.teamManagementAdd": "Comprehensive dashboard for tracking attendance, performance, and project progress in real-time.",
    "features.learnMore": "Learn More",
    "features.keyFeatures": "Key Features",
    "features.close": "Close",
    
    // Contact Page
    "contact.title": "Contact Quick Hire Crew",
    "contact.subtitle": "Get in touch with our team",
    
    // Login/Register
    "auth.email": "Email",
    "auth.emailOrUsername": "Email or Username",
    "auth.enterEmailOrUsername": "Enter your email or username",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.fullName": "Full Name",
    "auth.username": "Username",
    "auth.phoneNumber": "Phone Number",
    "auth.login": "Sign In",
    "auth.register": "Register",
    "auth.forgotPassword": "Forgot Password?",
    "auth.noAccount": "Don't have an account?",
    "auth.haveAccount": "Already have an account?",
    "auth.registerNow": "Register Now",
    "auth.loginNow": "Sign in",
    "auth.welcomeBack": "Welcome back to Quick Hire Crew",
    "auth.createAccount": "Create Account",
    "auth.signUpToStart": "Sign up to get started",
    "auth.accountType": "Account Type",
    "auth.contractor": "Contractor",
    "auth.company": "Company",
    "auth.registerAccount": "Register Account",
    "auth.backToHome": "Back to Home",
    
    // 404 Page
    "notFound.title": "404",
    "notFound.subtitle": "Oops! Page not found",
    "notFound.message": "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
    "notFound.return": "Return to Home"
  },
  spanish: {
    // Navbar
    "nav.about": "Acerca de",
    "nav.features": "Características",
    "nav.contact": "Contacto",
    "nav.register": "Registrarse",
    "nav.login": "Iniciar Sesión",
    
    // Hero
    "hero.title": "Construye Tu Futuro en Construcción",
    "hero.subtitle": "La forma más rápida de encontrar trabajo o contratar a profesionales calificados en tu área. Únete a miles de profesionales que hacen conexiones todos los días.",
    "hero.language": "Idioma:",
    "hero.needWork": "Necesito Trabajo",
    "hero.needHire": "Necesito Contratar",
    
    // Dashboard
    "dashboard.welcomeBack": "¡Bienvenido de nuevo, {name}!",
    "dashboard.jobSearchProgress": "Aquí está el resumen del progreso de tu búsqueda de trabajo",
    "dashboard.findJobs": "Buscar Trabajos",
    "dashboard.myProfile": "Mi Perfil",
    "dashboard.totalApplications": "Total de Solicitudes",
    "dashboard.jobsApplied": "Trabajos a los que has aplicado",
    "dashboard.acceptedJobs": "Trabajos Aceptados",
    "dashboard.successfullyLanded": "Posiciones obtenidas exitosamente",
    "dashboard.weeklyEarning": "Potencial de Ingresos Semanal",
    "dashboard.basedOn40hr": "Basado en semana laboral de 40 horas",
    "dashboard.matchScore": "Puntuación de Coincidencia",
    "dashboard.acceptanceRate": "Tasa de aceptación de trabajos",
    "dashboard.activeApplications": "Solicitudes Activas",
    "dashboard.availableJobs": "Trabajos Disponibles",
    "dashboard.recentActivity": "Actividad Reciente",
    
    // Dashboard Sidebar
    "dashboard.sidebar.dashboard": "Panel Principal",
    "dashboard.sidebar.messages": "Mensajes",
    "dashboard.sidebar.profile": "Perfil",
    "dashboard.sidebar.availableJobs": "Trabajos Disponibles",
    "dashboard.sidebar.payments": "Pagos",
    "dashboard.sidebar.settings": "Configuración",
    
    // Home Page
    "home.whyChoose": "¿Por qué elegir QuickHireCrew?",
    "home.connectTitle": "Conecta con Empresas Destacadas",
    "home.connectDesc": "Accede a oportunidades con compañías líderes de construcción en tu área",
    "home.skilledTitle": "Mano de Obra Calificada",
    "home.skilledDesc": "Encuentra contratistas calificados para tus proyectos de construcción",
    "home.quickTitle": "Contratación Rápida",
    "home.quickDesc": "Proceso optimizado para conseguir trabajadores en la obra más rápido",
    "home.verifiedTitle": "Perfiles Verificados",
    "home.verifiedDesc": "Todos los contratistas y empresas son rigurosamente evaluados",
    "home.testimonials": "Lo que Dicen Nuestros Usuarios",
    "home.readyToStart": "¿Listo para Comenzar?",
    "home.joinThousands": "Únete a miles de profesionales de la construcción que ya utilizan QuickHireCrew",
    "home.signUpNow": "Regístrate Ahora",
    "home.activeUsers": "Usuarios Activos",
    "home.successRate": "Tasa de Éxito",
    "home.userRating": "Valoración de Usuarios",
    
    // About Page
    "about.title": "Acerca de Quick Hire Crew",
    "about.subtitle": "Conectando empresas de construcción con trabajadores temporales calificados",
    "about.mission": "Nuestra Misión",
    "about.missionText": "Revolucionar la dotación de personal temporal en la construcción creando conexiones fluidas entre trabajadores calificados y empresas, asegurando que los proyectos se mantengan según lo programado y que los trabajadores encuentren oportunidades significativas.",
    "about.vision": "Nuestra Visión",
    "about.visionText": "Convertirse en la plataforma líder para la gestión de la fuerza laboral en la construcción, facilitando más que nunca la búsqueda y gestión de mano de obra temporal calificada.",
    "about.companies": "Empresas",
    "about.workers": "Trabajadores",
    "about.jobsCompleted": "Trabajos Completados",
    "about.successRate": "Tasa de Éxito",
    "about.howItWorks": "Cómo Funciona",
    "about.howItWorksText": "Quick Hire Crew proporciona una plataforma optimizada donde las empresas de construcción pueden encontrar y contratar rápidamente trabajadores temporales según sus necesidades específicas. Nuestro sistema de coincidencia considera habilidades, experiencia y disponibilidad para garantizar el ajuste perfecto.",
    "about.whyChooseUs": "Por Qué Elegirnos",
    "about.quickMatching": "Proceso de coincidencia rápido y eficiente",
    "about.verifiedWorkers": "Trabajadores calificados verificados",
    "about.securePayment": "Sistema de pago seguro",
    "about.realTimeCommunication": "Comunicación en tiempo real",
    "about.ratingSystem": "Sistema de calificación y reseñas",
    "about.joinToday": "Únete a Quick Hire Crew Hoy",
    
    // Features Page
    "features.title": "Características de Quick Hire Crew",
    "features.subtitle": "Todo lo que necesitas para gestionar la fuerza laboral temporal en construcción",
    "features.smartMatching": "Coincidencia Inteligente",
    "features.smartMatchingDesc": "Algoritmo avanzado para conectar trabajadores con los trabajos adecuados según habilidades y experiencia.",
    "features.smartMatchingAdd": "Nuestro sistema de coincidencia impulsado por IA considera ubicación, habilidades, experiencia y disponibilidad para garantizar el ajuste perfecto para cada trabajo.",
    "features.messaging": "Mensajería Instantánea",
    "features.messagingDesc": "Comunicación en tiempo real entre empresas y trabajadores para una mejor coordinación.",
    "features.messagingAdd": "Sistema de chat incorporado con confirmaciones de lectura, compartición de archivos y notificaciones automáticas para mantener a todos sincronizados.",
    "features.payments": "Pagos Seguros",
    "features.paymentsDesc": "Procesamiento de pagos seguro y confiable para todo el trabajo completado.",
    "features.paymentsAdd": "Protegido por encriptación estándar de la industria con facturación automatizada y seguimiento de pagos.",
    "features.profiles": "Perfiles Verificados",
    "features.profilesDesc": "Todos los trabajadores y empresas están verificados para garantizar seguridad y confiabilidad.",
    "features.profilesAdd": "Proceso de verificación de múltiples pasos que incluye comprobación de documentos y verificación de referencias para tu tranquilidad.",
    "features.quickHiring": "Contratación Rápida",
    "features.quickHiringDesc": "Proceso optimizado para contratar trabajadores temporales en cuestión de horas.",
    "features.quickHiringAdd": "Reduce el tiempo de contratación de semanas a horas con nuestros flujos de trabajo optimizados y coincidencia instantánea.",
    "features.teamManagement": "Gestión de Equipos",
    "features.teamManagementDesc": "Herramientas fáciles para gestionar múltiples trabajadores y proyectos.",
    "features.teamManagementAdd": "Panel de control completo para seguimiento de asistencia, rendimiento y progreso del proyecto en tiempo real.",
    "features.learnMore": "Más Información",
    "features.keyFeatures": "Características Principales",
    "features.close": "Cerrar",
    
    // Contact Page
    "contact.title": "Contactar a Quick Hire Crew",
    "contact.subtitle": "Ponte en contacto con nuestro equipo",
    
    // Login/Register
    "auth.email": "Correo Electrónico",
    "auth.emailOrUsername": "Correo o Nombre de Usuario",
    "auth.enterEmailOrUsername": "Ingresa tu correo o nombre de usuario",
    "auth.password": "Contraseña",
    "auth.confirmPassword": "Confirmar Contraseña",
    "auth.fullName": "Nombre Completo",
    "auth.username": "Nombre de Usuario",
    "auth.phoneNumber": "Número de Teléfono",
    "auth.login": "Iniciar Sesión",
    "auth.register": "Registrarse",
    "auth.forgotPassword": "¿Olvidaste tu Contraseña?",
    "auth.noAccount": "¿No tienes una cuenta?",
    "auth.haveAccount": "¿Ya tienes una cuenta?",
    "auth.registerNow": "Regístrate Ahora",
    "auth.loginNow": "Inicia Sesión",
    "auth.welcomeBack": "Bienvenido de nuevo a Quick Hire Crew",
    "auth.createAccount": "Crear Cuenta",
    "auth.signUpToStart": "Regístrate para comenzar",
    "auth.accountType": "Tipo de Cuenta",
    "auth.contractor": "Contratista",
    "auth.company": "Empresa",
    "auth.registerAccount": "Registrar Cuenta",
    "auth.backToHome": "Volver al Inicio",
    
    // 404 Page
    "notFound.title": "404",
    "notFound.subtitle": "¡Ups! Página no encontrada",
    "notFound.message": "La página que estás buscando puede haber sido eliminada, cambió de nombre o está temporalmente no disponible.",
    "notFound.return": "Volver al Inicio"
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: "english",
  setLanguage: () => {},
  translations,
  t: () => "",
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with stored preference or default to English
  const [language, setLanguageState] = useState<LanguageType>(() => {
    const storedLanguage = localStorage.getItem("language");
    return (storedLanguage as LanguageType) || "english";
  });

  // Translate function with parameter support
  const t = (key: string, params?: Record<string, string>): string => {
    let text = translations[language][key] || key;
    
    // Replace parameters in the text if any
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, value);
      });
    }
    
    return text;
  };

  // Update language and store in localStorage
  const setLanguage = (newLanguage: LanguageType) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  // Effect to set language based on localStorage when component mounts
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as LanguageType;
    if (storedLanguage && storedLanguage !== language) {
      setLanguageState(storedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
