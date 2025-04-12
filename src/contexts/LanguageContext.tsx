import React, { createContext, useContext, useState, useEffect } from 'react';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define the structure of your translations
interface Translation {
  [key: string]: {
    [key: string]: string;
  };
}

const translations = {
  en: {
    auth: {
      login: "Login",
      register: "Register",
      emailOrUsername: "Email or Username",
      enterEmailOrUsername: "Enter your email or username",
      password: "Password",
      forgotPassword: "Forgot Password?",
      loginSuccess: "Login Successful!",
      registerSuccess: "Registration Successful!",
      welcomeBack: "Welcome back!",
      noAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",
      backToHome: "Back to Home",
      loggingIn: "Logging in...",
      loginError: "Login Error",
      pleaseEnterCredentials: "Please enter your email and password.",
      redirecting: "Redirecting...",
      username: "Username",
      email: "Email",
      confirmPassword: "Confirm Password",
      passwordsDontMatch: "Passwords do not match",
      registering: "Registering...",
      enterYourUsername: "Enter your username",
      enterYourEmail: "Enter your email",
      enterYourPassword: "Enter your password",
      enterPasswordAgain: "Enter password again"
    },
    home: {
      heroTitle: "Find Your Perfect Crew",
      heroSubtitle: "Connecting contractors with skilled workers for successful projects.",
      getStarted: "Get Started",
      learnMore: "Learn More",
      featuresTitle: "Why Choose QuickHireCrew?",
      feature1Title: "Vetted Professionals",
      feature1Description: "Access a network of skilled and reliable contractors.",
      feature2Title: "Efficient Matching",
      feature2Description: "Quickly find the right workers for your specific project needs.",
      feature3Title: "Secure Payments",
      feature3Description: "Ensure smooth and secure transactions for all parties.",
      testimonialsTitle: "What Our Users Say",
      testimonial1Text: "QuickHireCrew has revolutionized how we find skilled labor. Highly recommended!",
      testimonial1Author: "John Doe, Construction Manager",
      testimonial2Text: "As a contractor, I've found consistent work and reliable payments through this platform.",
      testimonial2Author: "Alice Smith, Carpenter",
      ctaTitle: "Ready to Build Something Great?",
      ctaDescription: "Join QuickHireCrew today and experience the future of construction staffing.",
      ctaButton: "Sign Up Now"
    },
    about: {
      title: "About QuickHireCrew",
      section1Title: "Our Mission",
      section1Description: "At QuickHireCrew, we aim to bridge the gap between construction contractors and skilled workers, ensuring projects are completed efficiently and successfully. We provide a platform where quality meets opportunity.",
      section2Title: "Our Vision",
      section2Description: "To become the leading platform in construction staffing, known for reliability, efficiency, and innovation. We envision a future where every construction project has access to the best talent available.",
      section3Title: "Our Values",
      section3Description: "Integrity, transparency, and commitment to excellence. We believe in fostering a community built on trust and mutual respect.",
      teamTitle: "Meet Our Team",
      teamMember1Name: "Alex Johnson",
      teamMember1Title: "CEO",
      teamMember2Name: "Emily White",
      teamMember2Title: "CTO",
      teamMember3Name: "David Brown",
      teamMember3Title: "Head of Operations"
    },
    features: {
      title: "Key Features",
      feature1Title: "Advanced Matching Algorithm",
      feature1Description: "Our algorithm ensures you find the perfect match for your project requirements.",
      feature2Title: "Secure Payment System",
      feature2Description: "Enjoy peace of mind with our secure and transparent payment system.",
      feature3Title: "Real-time Communication",
      feature3Description: "Stay connected with your team through our integrated communication tools.",
      feature4Title: "Project Management Tools",
      feature4Description: "Manage your projects efficiently with our comprehensive suite of tools.",
      feature5Title: "User Reviews and Ratings",
      feature5Description: "Make informed decisions with access to user reviews and ratings.",
      feature6Title: "Mobile Accessibility",
      feature6Description: "Access QuickHireCrew on the go with our mobile-friendly platform."
    },
    contact: {
      title: "Contact Us",
      subtitle: "We'd love to hear from you!",
      nameLabel: "Your Name",
      emailLabel: "Your Email",
      messageLabel: "Message",
      sendButton: "Send Message",
      addressTitle: "Address",
      addressLine1: "123 Construction Ave",
      addressLine2: "Cityville, State 12345",
      phoneTitle: "Phone",
      phoneValue: "555-123-4567",
      emailTitle: "Email",
      emailValue: "info@quickhirecrew.com"
    },
    footer: {
      aboutUs: "About Us",
      features: "Features",
      contact: "Contact",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      copyright: "© 2024 QuickHireCrew. All rights reserved."
    },
    notFound: {
      title: "404 - Page Not Found",
      description: "The page you are looking for does not exist.",
      backToHome: "Back to Home"
    },
    
    // Dashboard translations
    dashboard: {
      welcomeBack: "Welcome back, {{name}}!",
      jobSearchProgress: "Here's your job search progress overview",
      findJobs: "Find Jobs",
      myProfile: "My Profile",
      jobsAppliedTo: "Jobs you've applied to",
      successfullyLanded: "Successfully landed positions",
      basedOn40hr: "Based on 40hr work week",
      jobAcceptanceRate: "Job acceptance rate",
      activeApplications: "Active Applications",
      availableJobs: "Available Jobs",
      recentActivity: "Recent Activity",
      totalApplications: "Total Applications"
    },
    sidebar: {
      dashboard: "Dashboard",
      messages: "Messages",
      profile: "Profile",
      availableJobs: "Available Jobs",
      payments: "Payments",
      settings: "Settings",
      contractor: "Contractor"
    }
  },
  es: {
    auth: {
      login: "Iniciar sesión",
      register: "Registrarse",
      emailOrUsername: "Correo electrónico o nombre de usuario",
      enterEmailOrUsername: "Ingrese su correo electrónico o nombre de usuario",
      password: "Contraseña",
      forgotPassword: "¿Olvidaste tu contraseña?",
      loginSuccess: "¡Inicio de sesión exitoso!",
      registerSuccess: "¡Registro exitoso!",
      welcomeBack: "¡Bienvenido de nuevo!",
      noAccount: "¿No tienes una cuenta?",
      alreadyHaveAccount: "¿Ya tienes una cuenta?",
      backToHome: "Volver a la página principal",
      loggingIn: "Iniciando sesión...",
      loginError: "Error de inicio de sesión",
      pleaseEnterCredentials: "Por favor, ingrese su correo electrónico y contraseña.",
      redirecting: "Redirigiendo...",
      username: "Nombre de usuario",
      email: "Correo electrónico",
      confirmPassword: "Confirmar contraseña",
      passwordsDontMatch: "Las contraseñas no coinciden",
      registering: "Registrando...",
      enterYourUsername: "Ingrese su nombre de usuario",
      enterYourEmail: "Ingrese su correo electrónico",
      enterYourPassword: "Ingrese su contraseña",
      enterPasswordAgain: "Ingrese la contraseña de nuevo"
    },
    home: {
      heroTitle: "Encuentra tu equipo perfecto",
      heroSubtitle: "Conectando a los contratistas con trabajadores calificados para proyectos exitosos.",
      getStarted: "Empezar",
      learnMore: "Aprender más",
      featuresTitle: "¿Por qué elegir QuickHireCrew?",
      feature1Title: "Profesionales examinados",
      feature1Description: "Acceda a una red de contratistas capacitados y confiables.",
      feature2Title: "Coincidencia eficiente",
      feature2Description: "Encuentre rápidamente a los trabajadores adecuados para las necesidades específicas de su proyecto.",
      feature3Title: "Pagos seguros",
      feature3Description: "Garantice transacciones fluidas y seguras para todas las partes.",
      testimonialsTitle: "Lo que dicen nuestros usuarios",
      testimonial1Text: "QuickHireCrew ha revolucionado la forma en que encontramos mano de obra calificada. ¡Muy recomendado!",
      testimonial1Author: "John Doe, Gerente de Construcción",
      testimonial2Text: "Como contratista, he encontrado trabajo constante y pagos confiables a través de esta plataforma.",
      testimonial2Author: "Alice Smith, Carpintera",
      ctaTitle: "¿Listo para construir algo grandioso?",
      ctaDescription: "Únase a QuickHireCrew hoy y experimente el futuro de la dotación de personal de construcción.",
      ctaButton: "Regístrate ahora"
    },
    about: {
      title: "Acerca de QuickHireCrew",
      section1Title: "Nuestra misión",
      section1Description: "En QuickHireCrew, nuestro objetivo es cerrar la brecha entre los contratistas de construcción y los trabajadores calificados, asegurando que los proyectos se completen de manera eficiente y exitosa. Proporcionamos una plataforma donde la calidad se une a la oportunidad.",
      section2Title: "Nuestra visión",
      section2Description: "Convertirnos en la plataforma líder en dotación de personal de construcción, conocida por su confiabilidad, eficiencia e innovación. Visualizamos un futuro donde cada proyecto de construcción tenga acceso al mejor talento disponible.",
      section3Title: "Nuestros valores",
      section3Description: "Integridad, transparencia y compromiso con la excelencia. Creemos en fomentar una comunidad basada en la confianza y el respeto mutuo.",
      teamTitle: "Conoce a nuestro equipo",
      teamMember1Name: "Alex Johnson",
      teamMember1Title: "CEO",
      teamMember2Name: "Emily White",
      teamMember2Title: "CTO",
      teamMember3Name: "David Brown",
      teamMember3Title: "Jefe de Operaciones"
    },
    features: {
      title: "Características clave",
      feature1Title: "Algoritmo de coincidencia avanzado",
      feature1Description: "Nuestro algoritmo garantiza que encuentre la combinación perfecta para los requisitos de su proyecto.",
      feature2Title: "Sistema de pago seguro",
      feature2Description: "Disfrute de la tranquilidad con nuestro sistema de pago seguro y transparente.",
      feature3Title: "Comunicación en tiempo real",
      feature3Description: "Manténgase conectado con su equipo a través de nuestras herramientas de comunicación integradas.",
      feature4Title: "Herramientas de gestión de proyectos",
      feature4Description: "Administre sus proyectos de manera eficiente con nuestro conjunto completo de herramientas.",
      feature5Title: "Reseñas y calificaciones de usuarios",
      feature5Description: "Tome decisiones informadas con acceso a reseñas y calificaciones de usuarios.",
      feature6Title: "Accesibilidad móvil",
      feature6Description: "Acceda a QuickHireCrew sobre la marcha con nuestra plataforma compatible con dispositivos móviles."
    },
    contact: {
      title: "Contáctenos",
      subtitle: "¡Nos encantaría saber de usted!",
      nameLabel: "Su nombre",
      emailLabel: "Su correo electrónico",
      messageLabel: "Mensaje",
      sendButton: "Enviar mensaje",
      addressTitle: "Dirección",
      addressLine1: "123 Construction Ave",
      addressLine2: "Cityville, State 12345",
      phoneTitle: "Teléfono",
      phoneValue: "555-123-4567",
      emailTitle: "Correo electrónico",
      emailValue: "info@quickhirecrew.com"
    },
    footer: {
      aboutUs: "Acerca de nosotros",
      features: "Características",
      contact: "Contacto",
      privacyPolicy: "Política de privacidad",
      termsOfService: "Términos de servicio",
      copyright: "© 2024 QuickHireCrew. Reservados todos los derechos."
    },
    notFound: {
      title: "404 - Página no encontrada",
      description: "La página que está buscando no existe.",
      backToHome: "Volver a la página principal"
    },
    
    // Dashboard translations
    dashboard: {
      welcomeBack: "¡Bienvenido de nuevo, {{name}}!",
      jobSearchProgress: "Aquí tienes un resumen del progreso de tu búsqueda de trabajo",
      findJobs: "Buscar Trabajos",
      myProfile: "Mi Perfil",
      jobsAppliedTo: "Trabajos a los que has aplicado",
      successfullyLanded: "Posiciones conseguidas con éxito",
      basedOn40hr: "Basado en semana laboral de 40h",
      jobAcceptanceRate: "Tasa de aceptación de trabajo",
      activeApplications: "Solicitudes Activas",
      availableJobs: "Trabajos Disponibles",
      recentActivity: "Actividad Reciente",
      totalApplications: "Total de Solicitudes"
    },
    sidebar: {
      dashboard: "Panel Principal",
      messages: "Mensajes",
      profile: "Perfil",
      availableJobs: "Trabajos Disponibles",
      payments: "Pagos",
      settings: "Configuración",
      contractor: "Contratista"
    }
  },
  fr: {
    auth: {
      login: "Connexion",
      register: "S'inscrire",
      emailOrUsername: "Email ou Nom d'utilisateur",
      enterEmailOrUsername: "Entrez votre email ou nom d'utilisateur",
      password: "Mot de passe",
      forgotPassword: "Mot de passe oublié?",
      loginSuccess: "Connexion réussie!",
      registerSuccess: "Inscription réussie!",
      welcomeBack: "Bienvenue de nouveau!",
      noAccount: "Vous n'avez pas de compte?",
      alreadyHaveAccount: "Vous avez déjà un compte?",
      backToHome: "Retour à l'accueil",
      loggingIn: "Connexion en cours...",
      loginError: "Erreur de connexion",
      pleaseEnterCredentials: "Veuillez entrer votre email et votre mot de passe.",
      redirecting: "Redirection...",
      username: "Nom d'utilisateur",
      email: "Email",
      confirmPassword: "Confirmer le mot de passe",
      passwordsDontMatch: "Les mots de passe ne correspondent pas",
      registering: "Enregistrement...",
      enterYourUsername: "Entrez votre nom d'utilisateur",
      enterYourEmail: "Entrez votre email",
      enterYourPassword: "Entrez votre mot de passe",
      enterPasswordAgain: "Entrez le mot de passe à nouveau"
    },
    home: {
      heroTitle: "Trouvez votre équipe idéale",
      heroSubtitle: "Mettre en relation les entrepreneurs avec des travailleurs qualifiés pour des projets réussis.",
      getStarted: "Commencer",
      learnMore: "En savoir plus",
      featuresTitle: "Pourquoi choisir QuickHireCrew?",
      feature1Title: "Professionnels vérifiés",
      feature1Description: "Accédez à un réseau d'entrepreneurs qualifiés et fiables.",
      feature2Title: "Correspondance efficace",
      feature2Description: "Trouvez rapidement les bons travailleurs pour les besoins spécifiques de votre projet.",
      feature3Title: "Paiements sécurisés",
      feature3Description: "Assurez des transactions fluides et sécurisées pour toutes les parties.",
      testimonialsTitle: "Ce que disent nos utilisateurs",
      testimonial1Text: "QuickHireCrew a révolutionné notre façon de trouver de la main-d'œuvre qualifiée. Hautement recommandé!",
      testimonial1Author: "John Doe, Chef de chantier",
      testimonial2Text: "En tant qu'entrepreneur, j'ai trouvé un travail constant et des paiements fiables grâce à cette plateforme.",
      testimonial2Author: "Alice Smith, Charpentière",
      ctaTitle: "Prêt à construire quelque chose de grand?",
      ctaDescription: "Rejoignez QuickHireCrew dès aujourd'hui et découvrez l'avenir de la dotation en personnel de construction.",
      ctaButton: "Inscrivez-vous maintenant"
    },
    about: {
      title: "À propos de QuickHireCrew",
      section1Title: "Notre mission",
      section1Description: "Chez QuickHireCrew, notre objectif est de combler le fossé entre les entrepreneurs en construction et les travailleurs qualifiés, en veillant à ce que les projets soient réalisés de manière efficace et réussie. Nous fournissons une plateforme où la qualité rencontre l'opportunité.",
      section2Title: "Notre vision",
      section2Description: "Devenir la principale plateforme de dotation en personnel de construction, reconnue pour sa fiabilité, son efficacité et son innovation. Nous envisageons un avenir où chaque projet de construction a accès aux meilleurs talents disponibles.",
      section3Title: "Nos valeurs",
      section3Description: "Intégrité, transparence et engagement envers l'excellence. Nous croyons qu'il faut favoriser une communauté basée sur la confiance et le respect mutuel.",
      teamTitle: "Rencontrez notre équipe",
      teamMember1Name: "Alex Johnson",
      teamMember1Title: "PDG",
      teamMember2Name: "Emily White",
      teamMember2Title: "CTO",
      teamMember3Name: "David Brown",
      teamMember3Title: "Chef des opérations"
    },
    features: {
      title: "Principales caractéristiques",
      feature1Title: "Algorithme de correspondance avancé",
      feature1Description: "Notre algorithme vous assure de trouver la combinaison parfaite pour les exigences de votre projet.",
      feature2Title: "Système de paiement sécurisé",
      feature2Description: "Profitez d'une tranquillité d'esprit grâce à notre système de paiement sécurisé et transparent.",
      feature3Title: "Communication en temps réel",
      feature3Description: "Restez connecté avec votre équipe grâce à nos outils de communication intégrés.",
      feature4Title: "Outils de gestion de projet",
      feature4Description: "Gérez efficacement vos projets grâce à notre suite complète d'outils.",
      feature5Title: "Avis et évaluations des utilisateurs",
      feature5Description: "Prenez des décisions éclairées grâce à l'accès aux avis et évaluations des utilisateurs.",
      feature6Title: "Accessibilité mobile",
      feature6Description: "Accédez à QuickHireCrew en déplacement grâce à notre plateforme adaptée aux mobiles."
    },
    contact: {
      title: "Contactez-nous",
      subtitle: "Nous aimerions avoir de vos nouvelles!",
      nameLabel: "Votre nom",
      emailLabel: "Votre email",
      messageLabel: "Message",
      sendButton: "Envoyer le message",
      addressTitle: "Adresse",
      addressLine1: "123 Construction Ave",
      addressLine2: "Cityville, State 12345",
      phoneTitle: "Téléphone",
      phoneValue: "555-123-4567",
      emailTitle: "Email",
      emailValue: "info@quickhirecrew.com"
    },
    footer: {
      aboutUs: "À propos de nous",
      features: "Caractéristiques",
      contact: "Contact",
      privacyPolicy: "Politique de confidentialité",
      termsOfService: "Conditions d'utilisation",
      copyright: "© 2024 QuickHireCrew. Tous droits réservés."
    },
    notFound: {
      title: "404 - Page non trouvée",
      description: "La page que vous recherchez n'existe pas.",
      backToHome: "Retour à l'accueil"
    },
    
    // Dashboard translations
    dashboard: {
      welcomeBack: "Bon retour, {{name}} !",
      jobSearchProgress: "Voici un aperçu des progrès de votre recherche d'emploi",
      findJobs: "Trouver des Emplois",
      myProfile: "Mon Profil",
      jobsAppliedTo: "Emplois auxquels vous avez postulé",
      successfullyLanded: "Postes obtenus avec succès",
      basedOn40hr: "Basé sur une semaine de 40h",
      jobAcceptanceRate: "Taux d'acceptation des emplois",
      activeApplications: "Candidatures Actives",
      availableJobs: "Emplois Disponibles",
      recentActivity: "Activité Récente",
      totalApplications: "Total des Candidatures"
    },
    sidebar: {
      dashboard: "Tableau de Bord",
      messages: "Messages",
      profile: "Profil",
      availableJobs: "Emplois Disponibles",
      payments: "Paiements",
      settings: "Paramètres",
      contractor: "Entrepreneur"
    }
  }
};

// Create the Language Context
const LanguageContext = createContext<{
  language: string;
  t: (key: string, options?: { [key: string]: any }) => string;
  setLanguage: (lang: string) => void;
}>({
  language: 'en',
  t: (key) => key,
  setLanguage: () => { },
});

// Language Provider Component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    i18next
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources: {
          en: { translation: translations.en },
          es: { translation: translations.es },
          fr: { translation: translations.fr },
        },
        lng: language,
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false,
        },
      });
  }, [language]);

  // Function to change the language
  const changeLanguage = (lang: string) => {
    i18next.changeLanguage(lang);
    setLanguage(lang);
  };

  // Translation function
  const t = (key: string, options?: { [key: string]: any }) => {
    return i18next.t(key, options);
  };

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage: changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  return useContext(LanguageContext);
};
