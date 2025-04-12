import { makeAutoObservable } from 'mobx';

class ProfileStore {
  wallet: string | null = null;
  isAuthenticated = false;
  cryptoPortfolio = [];
  recommendations = [];

  constructor() {
    makeAutoObservable(this);
  }

  connectWallet = async () => {
    // Логика подключения кошелька
    // this.wallet = connected address
    // this.isAuthenticated = true
  }

  fetchUserData = async () => {
    // Загрузка данных пользователя после авторизации
  }

  generateRecommendations = () => {
    // Логика формирования рекомендаций на основе cryptoPortfolio
  }
}