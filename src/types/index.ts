export interface Game {
  _id: string;
  slug: string;
  name: string;
  logo: string;
  sections: {
    overview: { text: string; image: string };
    versions: { text: string; image: string };
    uses: { text: string; image: string };
    features: { text: string; image: string };
    system: { text: string; image: string };
  };
  alternatives: Game[];
  downloadLink: string;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  undeletable?: boolean;
  _id: string;
  username: string;
  createdAt: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  admin: Admin | null;
  login: (token: string, admin: Admin) => void;
  logout: () => void;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface GameForm {
  name: string;
  logo: File | null;
  sections: {
    overview: { text: string; image: File | null };
    versions: { text: string; image: File | null };
    uses: { text: string; image: File | null };
    features: { text: string; image: File | null };
    system: { text: string; image: File | null };
  };
  alternatives: string[];
  downloadLink: string;
}