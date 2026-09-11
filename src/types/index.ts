/**
 * Types globaux et structures de l'application de Gestion de Clinique.
 * Préparation de l'architecture pour les modules futurs (Auth, DB, Prestations, Rapports).
 */

export interface MenuItem {
  title: string;
  href: string;
  iconName: string;
  badge?: string;
  isAvailable: boolean;
}

export interface SystemStatus {
  module: string;
  status: 'pret' | 'en_attente' | 'planifie';
  description: string;
}
