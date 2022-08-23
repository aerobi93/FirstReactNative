export const mommentDay = (hour) => {
    let momment = '';
    switch (hour) {
      case 10:
        momment = 'ce matin';
        break;
      case 14:
        momment = 'cette apres midi';
        break;
      case 18:
        momment = 'ce soir';
        break;
      case 22:
        momment = 'cette nuit';
        break;
      default:
        momment = 'actuelement';
    }
    return momment;
  };
  
  export const dayDisplay = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const days = date.getDay();
    let day = '';
    switch (days) {
      case 0:
        day = 'Dim';
        break;
      case 1:
        day = 'Lun';
        break;
      case 2:
        day = 'Mar';
        break;
      case 3:
        day = 'Merc';
        break;
      case 4:
        day = 'Jeu';
        break;
      case 5:
        day = 'Vend';
        break;
      case 6:
        day = 'Sam';
        break;
      default: '';
    }
    return day;
  };

  export const searchTempMin = (meteoHourly) => {
    const min = meteoHourly.map((tempMin) => (tempMin.temp));
    return Math.min(...min);
  };
  
  export const searchTempMax = (meteoHourly) => {
    const max = meteoHourly.map((tempMax) => (tempMax.temp));
    return Math.max(...max);
  };