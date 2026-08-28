export interface LocalityItem {
  name: string;
  latitude: number;
  longitude: number;
  type?: 'city' | 'town' | 'village' | 'suburb';
}

export interface DistrictItem {
  name: string;
  latitude?: number;
  longitude?: number;
  localities: LocalityItem[];
}

export interface RegionItem {
  name: string;
  latitude?: number;
  longitude?: number;
  districts: DistrictItem[];
}

export const DIVISIONS_DATA: Record<string, RegionItem[]> = {
  // 🇱🇰 SRI LANKA (Comprehensive 9 Provinces, 25 Districts, 250+ Cities & Villages)
  'LK': [
    {
      name: 'Western Province',
      districts: [
        {
          name: 'Gampaha',
          localities: [
            { name: 'Kotugoda', latitude: 7.1245, longitude: 79.9215, type: 'village' },
            { name: 'Minuwangoda', latitude: 7.1685, longitude: 79.9525, type: 'town' },
            { name: 'Ja-Ela', latitude: 7.0758, longitude: 79.8920, type: 'town' },
            { name: 'Negombo', latitude: 7.2008, longitude: 79.8737, type: 'city' },
            { name: 'Gampaha', latitude: 7.0840, longitude: 79.9943, type: 'city' },
            { name: 'Katunayake', latitude: 7.1693, longitude: 79.8894, type: 'town' },
            { name: 'Seeduwa', latitude: 7.1264, longitude: 79.8833, type: 'town' },
            { name: 'Raddoluwa', latitude: 7.1350, longitude: 79.9050, type: 'village' },
            { name: 'Kandana', latitude: 7.0478, longitude: 79.8975, type: 'town' },
            { name: 'Ragama', latitude: 7.0275, longitude: 79.9238, type: 'town' },
            { name: 'Mahabage', latitude: 7.0125, longitude: 79.8964, type: 'town' },
            { name: 'Wattala', latitude: 6.9897, longitude: 79.8928, type: 'town' },
            { name: 'Peliyagoda', latitude: 6.9667, longitude: 79.8833, type: 'town' },
            { name: 'Kelaniya', latitude: 6.9553, longitude: 79.9152, type: 'town' },
            { name: 'Kiribathgoda', latitude: 6.9806, longitude: 79.9286, type: 'town' },
            { name: 'Kadawatha', latitude: 7.0016, longitude: 79.9515, type: 'town' },
            { name: 'Ganemulla', latitude: 7.0600, longitude: 79.9600, type: 'town' },
            { name: 'Miriswatte', latitude: 7.0980, longitude: 80.0150, type: 'town' },
            { name: 'Yakkala', latitude: 7.0872, longitude: 80.0333, type: 'town' },
            { name: 'Nittambuwa', latitude: 7.1444, longitude: 80.0961, type: 'town' },
            { name: 'Veyangoda', latitude: 7.1517, longitude: 80.0578, type: 'town' },
            { name: 'Pasyala', latitude: 7.1500, longitude: 80.1333, type: 'town' },
            { name: 'Mirigama', latitude: 7.2436, longitude: 80.1306, type: 'town' },
            { name: 'Divulapitiya', latitude: 7.2189, longitude: 80.0039, type: 'town' },
            { name: 'Katana', latitude: 7.2333, longitude: 79.8833, type: 'village' },
            { name: 'Kochchikade', latitude: 7.2667, longitude: 79.8667, type: 'town' },
            { name: 'Pamunugama', latitude: 7.0833, longitude: 79.8500, type: 'village' },
            { name: 'Bopitiya', latitude: 7.0333, longitude: 79.8667, type: 'village' },
            { name: 'Uswetakeiyawa', latitude: 7.0050, longitude: 79.8650, type: 'village' },
            { name: 'Dompe', latitude: 6.9500, longitude: 80.0667, type: 'town' },
            { name: 'Pugoda', latitude: 6.9667, longitude: 80.1167, type: 'town' },
            { name: 'Weliweriya', latitude: 7.0333, longitude: 80.0167, type: 'town' },
            { name: 'Kirindiwela', latitude: 7.0500, longitude: 80.1333, type: 'town' },
            { name: 'Biyagama', latitude: 6.9333, longitude: 79.9833, type: 'town' },
            { name: 'Delgoda', latitude: 6.9833, longitude: 80.0000, type: 'town' },
            { name: 'Sapugaskanda', latitude: 6.9600, longitude: 79.9400, type: 'town' },
            { name: 'Makola', latitude: 6.9750, longitude: 79.9350, type: 'town' },
            { name: 'Henegama', latitude: 7.0667, longitude: 80.0333, type: 'village' },
            { name: 'Kalagedihena', latitude: 7.1167, longitude: 80.0667, type: 'village' },
            { name: 'Radawana', latitude: 7.0833, longitude: 80.1000, type: 'village' }
          ]
        },
        {
          name: 'Colombo',
          localities: [
            { name: 'Colombo Fort', latitude: 6.9344, longitude: 79.8428, type: 'city' },
            { name: 'Colombo', latitude: 6.9271, longitude: 79.8612, type: 'city' },
            { name: 'Pettah', latitude: 6.9367, longitude: 79.8531, type: 'suburb' },
            { name: 'Kollupitiya', latitude: 6.9147, longitude: 79.8522, type: 'suburb' },
            { name: 'Bambalapitiya', latitude: 6.8911, longitude: 79.8587, type: 'suburb' },
            { name: 'Havelock Town', latitude: 6.8833, longitude: 79.8667, type: 'suburb' },
            { name: 'Wellawatte', latitude: 6.8736, longitude: 79.8611, type: 'suburb' },
            { name: 'Cinnamon Gardens', latitude: 6.9080, longitude: 79.8670, type: 'suburb' },
            { name: 'Borella', latitude: 6.9147, longitude: 79.8778, type: 'suburb' },
            { name: 'Maradana', latitude: 6.9278, longitude: 79.8667, type: 'suburb' },
            { name: 'Dematagoda', latitude: 6.9333, longitude: 79.8833, type: 'suburb' },
            { name: 'Kotahena', latitude: 6.9450, longitude: 79.8620, type: 'suburb' },
            { name: 'Mattakkuliya', latitude: 6.9722, longitude: 79.8750, type: 'suburb' },
            { name: 'Dehiwala', latitude: 6.8528, longitude: 79.8667, type: 'city' },
            { name: 'Mount Lavinia', latitude: 6.8389, longitude: 79.8639, type: 'city' },
            { name: 'Ratmalana', latitude: 6.8217, longitude: 79.8742, type: 'town' },
            { name: 'Moratuwa', latitude: 6.7730, longitude: 79.8816, type: 'city' },
            { name: 'Sri Jayawardenepura Kotte', latitude: 6.8868, longitude: 79.9187, type: 'city' },
            { name: 'Rajagiriya', latitude: 6.9083, longitude: 79.8972, type: 'town' },
            { name: 'Nawala', latitude: 6.8917, longitude: 79.8889, type: 'town' },
            { name: 'Nugegoda', latitude: 6.8649, longitude: 79.8997, type: 'town' },
            { name: 'Kohuwala', latitude: 6.8583, longitude: 79.8889, type: 'suburb' },
            { name: 'Maharagama', latitude: 6.8480, longitude: 79.9265, type: 'town' },
            { name: 'Boralesgamuwa', latitude: 6.8400, longitude: 79.9000, type: 'town' },
            { name: 'Pannipitiya', latitude: 6.8444, longitude: 79.9556, type: 'town' },
            { name: 'Kottawa', latitude: 6.8417, longitude: 79.9667, type: 'town' },
            { name: 'Homagama', latitude: 6.8415, longitude: 80.0032, type: 'town' },
            { name: 'Meegoda', latitude: 6.8333, longitude: 80.0500, type: 'village' },
            { name: 'Godagama', latitude: 6.8450, longitude: 80.0300, type: 'town' },
            { name: 'Padukka', latitude: 6.8500, longitude: 80.1000, type: 'town' },
            { name: 'Hanwella', latitude: 6.9000, longitude: 80.0833, type: 'town' },
            { name: 'Avissawella', latitude: 6.9500, longitude: 80.2000, type: 'town' },
            { name: 'Kaduwela', latitude: 6.9328, longitude: 79.9839, type: 'town' },
            { name: 'Malabe', latitude: 6.9042, longitude: 79.9547, type: 'town' },
            { name: 'Battaramulla', latitude: 6.8990, longitude: 79.9170, type: 'town' },
            { name: 'Thalawathugoda', latitude: 6.8778, longitude: 79.9361, type: 'town' },
            { name: 'Pelawatte', latitude: 6.8917, longitude: 79.9278, type: 'suburb' },
            { name: 'Athurugiriya', latitude: 6.8722, longitude: 79.9889, type: 'town' },
            { name: 'Hokandara', latitude: 6.8700, longitude: 79.9600, type: 'village' },
            { name: 'Piliyandala', latitude: 6.8018, longitude: 79.9227, type: 'town' },
            { name: 'Kesbewa', latitude: 6.7833, longitude: 79.9500, type: 'town' },
            { name: 'Madapatha', latitude: 6.7667, longitude: 79.9333, type: 'village' },
            { name: 'Kahathuduwa', latitude: 6.7800, longitude: 79.9800, type: 'town' },
            { name: 'Kolonnawa', latitude: 6.9317, longitude: 79.8833, type: 'town' },
            { name: 'Wellampitiya', latitude: 6.9400, longitude: 79.8900, type: 'town' },
            { name: 'Angoda', latitude: 6.9300, longitude: 79.9100, type: 'town' },
            { name: 'Mulleriyawa', latitude: 6.9200, longitude: 79.9200, type: 'town' }
          ]
        },
        {
          name: 'Kalutara',
          localities: [
            { name: 'Kalutara', latitude: 6.5854, longitude: 79.9607, type: 'city' },
            { name: 'Panadura', latitude: 6.7132, longitude: 79.9074, type: 'city' },
            { name: 'Wadduwa', latitude: 6.6667, longitude: 79.9333, type: 'town' },
            { name: 'Horana', latitude: 6.7144, longitude: 80.0631, type: 'town' },
            { name: 'Bandaragama', latitude: 6.7142, longitude: 79.9897, type: 'town' },
            { name: 'Beruwala', latitude: 6.4788, longitude: 79.9828, type: 'town' },
            { name: 'Aluthgama', latitude: 6.4333, longitude: 80.0000, type: 'town' },
            { name: 'Bentota', latitude: 6.4253, longitude: 79.9961, type: 'town' },
            { name: 'Matugama', latitude: 6.5228, longitude: 80.1158, type: 'town' },
            { name: 'Agalawatta', latitude: 6.5333, longitude: 80.1500, type: 'town' },
            { name: 'Bulathsinhala', latitude: 6.6500, longitude: 80.1667, type: 'town' },
            { name: 'Dodangoda', latitude: 6.5833, longitude: 80.0500, type: 'town' },
            { name: 'Ingiriya', latitude: 6.7333, longitude: 80.1667, type: 'town' },
            { name: 'Paiyagala', latitude: 6.5333, longitude: 79.9833, type: 'village' },
            { name: 'Maggona', latitude: 6.5000, longitude: 79.9833, type: 'town' },
            { name: 'Neboda', latitude: 6.6000, longitude: 80.0833, type: 'village' },
            { name: 'Anguruwatota', latitude: 6.6833, longitude: 80.0833, type: 'village' }
          ]
        }
      ]
    },
    {
      name: 'Central Province',
      districts: [
        {
          name: 'Kandy',
          localities: [
            { name: 'Kandy', latitude: 7.2906, longitude: 80.6337, type: 'city' },
            { name: 'Peradeniya', latitude: 7.2604, longitude: 80.5960, type: 'town' },
            { name: 'Katugastota', latitude: 7.3236, longitude: 80.6186, type: 'town' },
            { name: 'Gampola', latitude: 7.1644, longitude: 80.5764, type: 'town' },
            { name: 'Nawalapitiya', latitude: 7.0500, longitude: 80.5333, type: 'town' },
            { name: 'Kundasale', latitude: 7.2889, longitude: 80.6869, type: 'town' },
            { name: 'Digana', latitude: 7.3000, longitude: 80.7333, type: 'town' },
            { name: 'Teldeniya', latitude: 7.3167, longitude: 80.7667, type: 'town' },
            { name: 'Wattegama', latitude: 7.3500, longitude: 80.6833, type: 'town' },
            { name: 'Akurana', latitude: 7.3667, longitude: 80.6167, type: 'town' },
            { name: 'Kadugannawa', latitude: 7.2500, longitude: 80.5167, type: 'town' },
            { name: 'Pilimathalawa', latitude: 7.2667, longitude: 80.5500, type: 'town' },
            { name: 'Menikhinna', latitude: 7.3167, longitude: 80.7000, type: 'town' },
            { name: 'Gelioya', latitude: 7.2167, longitude: 80.5833, type: 'town' },
            { name: 'Ampitiya', latitude: 7.2833, longitude: 80.6500, type: 'suburb' },
            { name: 'Pujapitiya', latitude: 7.3667, longitude: 80.5833, type: 'town' },
            { name: 'Madawala', latitude: 7.3333, longitude: 80.6667, type: 'town' },
            { name: 'Galagedara', latitude: 7.3833, longitude: 80.5333, type: 'town' },
            { name: 'Hunnasgiriya', latitude: 7.3833, longitude: 80.8500, type: 'village' }
          ]
        },
        {
          name: 'Matale',
          localities: [
            { name: 'Matale', latitude: 7.4675, longitude: 80.6234, type: 'city' },
            { name: 'Dambulla', latitude: 7.8742, longitude: 80.6511, type: 'town' },
            { name: 'Sigiriya', latitude: 7.9570, longitude: 80.7603, type: 'village' },
            { name: 'Galewela', latitude: 7.7500, longitude: 80.5667, type: 'town' },
            { name: 'Ukuwela', latitude: 7.4333, longitude: 80.6333, type: 'town' },
            { name: 'Rattota', latitude: 7.5167, longitude: 80.6667, type: 'town' },
            { name: 'Yatawatta', latitude: 7.5333, longitude: 80.5833, type: 'village' },
            { name: 'Naula', latitude: 7.7000, longitude: 80.6500, type: 'town' },
            { name: 'Pallepola', latitude: 7.5833, longitude: 80.5667, type: 'village' },
            { name: 'Wahacotte', latitude: 7.6333, longitude: 80.5833, type: 'village' }
          ]
        },
        {
          name: 'Nuwara Eliya',
          localities: [
            { name: 'Nuwara Eliya', latitude: 6.9497, longitude: 80.7891, type: 'city' },
            { name: 'Hatton', latitude: 6.8917, longitude: 80.5956, type: 'town' },
            { name: 'Talawakele', latitude: 6.9378, longitude: 80.6589, type: 'town' },
            { name: 'Maskeliya', latitude: 6.8333, longitude: 80.5667, type: 'town' },
            { name: 'Norwood', latitude: 6.8333, longitude: 80.6167, type: 'town' },
            { name: 'Ginigathena', latitude: 6.9833, longitude: 80.4833, type: 'town' },
            { name: 'Kotagala', latitude: 6.9333, longitude: 80.6000, type: 'town' },
            { name: 'Ragala', latitude: 7.0000, longitude: 80.8500, type: 'town' },
            { name: 'Nanu Oya', latitude: 6.9333, longitude: 80.7500, type: 'town' },
            { name: 'Lindula', latitude: 6.9167, longitude: 80.6833, type: 'town' },
            { name: 'Bogawantalawa', latitude: 6.8000, longitude: 80.6667, type: 'town' },
            { name: 'Hanguranketha', latitude: 7.1833, longitude: 80.7833, type: 'town' },
            { name: 'Walapane', latitude: 7.0833, longitude: 80.8667, type: 'town' }
          ]
        }
      ]
    },
    {
      name: 'Southern Province',
      districts: [
        {
          name: 'Galle',
          localities: [
            { name: 'Galle', latitude: 6.0535, longitude: 80.2210, type: 'city' },
            { name: 'Hikkaduwa', latitude: 6.1408, longitude: 80.1039, type: 'town' },
            { name: 'Ambalangoda', latitude: 6.2361, longitude: 80.0542, type: 'town' },
            { name: 'Karapitiya', latitude: 6.0667, longitude: 80.2333, type: 'town' },
            { name: 'Baddegama', latitude: 6.1833, longitude: 80.1833, type: 'town' },
            { name: 'Elpitiya', latitude: 6.2575, longitude: 80.1444, type: 'town' },
            { name: 'Unawatuna', latitude: 6.0108, longitude: 80.2489, type: 'village' },
            { name: 'Koggala', latitude: 5.9833, longitude: 80.3333, type: 'village' },
            { name: 'Ahangama', latitude: 5.9667, longitude: 80.3667, type: 'town' },
            { name: 'Balapitiya', latitude: 6.2667, longitude: 80.0333, type: 'town' },
            { name: 'Rathgama', latitude: 6.0833, longitude: 80.1500, type: 'village' },
            { name: 'Boossa', latitude: 6.0833, longitude: 80.1833, type: 'village' },
            { name: 'Habaraduwa', latitude: 6.0000, longitude: 80.3000, type: 'town' },
            { name: 'Imaduwa', latitude: 6.0667, longitude: 80.3667, type: 'town' },
            { name: 'Udugama', latitude: 6.2167, longitude: 80.3333, type: 'town' },
            { name: 'Batapola', latitude: 6.2333, longitude: 80.1000, type: 'village' },
            { name: 'Neluwa', latitude: 6.3667, longitude: 80.4333, type: 'town' }
          ]
        },
        {
          name: 'Matara',
          localities: [
            { name: 'Matara', latitude: 5.9549, longitude: 80.5550, type: 'city' },
            { name: 'Weligama', latitude: 5.9739, longitude: 80.4286, type: 'town' },
            { name: 'Mirissa', latitude: 5.9483, longitude: 80.4589, type: 'village' },
            { name: 'Dikwella', latitude: 5.9619, longitude: 80.6942, type: 'town' },
            { name: 'Akuressa', latitude: 6.0983, longitude: 80.4764, type: 'town' },
            { name: 'Hakmana', latitude: 6.1000, longitude: 80.6500, type: 'town' },
            { name: 'Kamburupitiya', latitude: 6.0833, longitude: 80.5667, type: 'town' },
            { name: 'Deniyaya', latitude: 6.3417, longitude: 80.5583, type: 'town' },
            { name: 'Gandara', latitude: 5.9333, longitude: 80.6000, type: 'village' },
            { name: 'Devinuwara (Dondra)', latitude: 5.9250, longitude: 80.5889, type: 'town' },
            { name: 'Kekanadurra', latitude: 5.9833, longitude: 80.6000, type: 'village' },
            { name: 'Thihagoda', latitude: 6.0167, longitude: 80.5667, type: 'town' },
            { name: 'Morawaka', latitude: 6.2667, longitude: 80.5000, type: 'town' },
            { name: 'Kotapola', latitude: 6.3000, longitude: 80.5333, type: 'town' },
            { name: 'Urubokka', latitude: 6.2667, longitude: 80.6500, type: 'town' }
          ]
        },
        {
          name: 'Hambantota',
          localities: [
            { name: 'Hambantota', latitude: 6.1429, longitude: 81.1212, type: 'city' },
            { name: 'Tangalle', latitude: 6.0244, longitude: 80.7942, type: 'town' },
            { name: 'Tissamaharama', latitude: 6.2794, longitude: 81.2869, type: 'town' },
            { name: 'Beliatta', latitude: 6.0500, longitude: 80.7333, type: 'town' },
            { name: 'Ambalantota', latitude: 6.1228, longitude: 81.0244, type: 'town' },
            { name: 'Ranna', latitude: 6.0667, longitude: 80.8833, type: 'town' },
            { name: 'Weeraketiya', latitude: 6.1333, longitude: 80.7500, type: 'town' },
            { name: 'Walasmulla', latitude: 6.1667, longitude: 80.7000, type: 'town' },
            { name: 'Katuwana', latitude: 6.2500, longitude: 80.6833, type: 'town' },
            { name: 'Middeniya', latitude: 6.2167, longitude: 80.7667, type: 'town' },
            { name: 'Suriyawewa', latitude: 6.3333, longitude: 81.0000, type: 'town' },
            { name: 'Lunugamvehera', latitude: 6.3500, longitude: 81.2000, type: 'town' },
            { name: 'Angunakolapelessa', latitude: 6.1667, longitude: 80.9000, type: 'town' },
            { name: 'Kirinda', latitude: 6.2167, longitude: 81.3333, type: 'village' }
          ]
        }
      ]
    },
    {
      name: 'North Western Province',
      districts: [
        {
          name: 'Kurunegala',
          localities: [
            { name: 'Kurunegala', latitude: 7.4863, longitude: 80.3623, type: 'city' },
            { name: 'Kuliyapitiya', latitude: 7.4689, longitude: 80.0400, type: 'town' },
            { name: 'Narammala', latitude: 7.4333, longitude: 80.2167, type: 'town' },
            { name: 'Wariyapola', latitude: 7.6167, longitude: 80.2667, type: 'town' },
            { name: 'Pannala', latitude: 7.3333, longitude: 79.9833, type: 'town' },
            { name: 'Giriulla', latitude: 7.3456, longitude: 80.1242, type: 'town' },
            { name: 'Alawwa', latitude: 7.3000, longitude: 80.2333, type: 'town' },
            { name: 'Polgahawela', latitude: 7.3333, longitude: 80.3000, type: 'town' },
            { name: 'Ibbagamuwa', latitude: 7.5500, longitude: 80.4500, type: 'town' },
            { name: 'Mawathagama', latitude: 7.4333, longitude: 80.4500, type: 'town' },
            { name: 'Nikaweratiya', latitude: 7.7500, longitude: 80.1167, type: 'town' },
            { name: 'Maho', latitude: 7.8167, longitude: 80.2667, type: 'town' },
            { name: 'Bingiriya', latitude: 7.5500, longitude: 80.0167, type: 'town' },
            { name: 'Hettipola', latitude: 7.6000, longitude: 80.0833, type: 'town' },
            { name: 'Dummalasuriya', latitude: 7.4167, longitude: 79.9500, type: 'village' },
            { name: 'Rideegama', latitude: 7.5333, longitude: 80.5000, type: 'town' },
            { name: 'Galgamuwa', latitude: 8.0000, longitude: 80.2667, type: 'town' },
            { name: 'Ganewatta', latitude: 7.6500, longitude: 80.3833, type: 'village' }
          ]
        },
        {
          name: 'Puttalam',
          localities: [
            { name: 'Puttalam', latitude: 8.0362, longitude: 79.8283, type: 'city' },
            { name: 'Chilaw', latitude: 7.5758, longitude: 79.7953, type: 'city' },
            { name: 'Wennappuwa', latitude: 7.3667, longitude: 79.8333, type: 'town' },
            { name: 'Marawila', latitude: 7.4167, longitude: 79.8167, type: 'town' },
            { name: 'Nattandiya', latitude: 7.4167, longitude: 79.8667, type: 'town' },
            { name: 'Dankotuwa', latitude: 7.3000, longitude: 79.8833, type: 'town' },
            { name: 'Anamaduwa', latitude: 7.9167, longitude: 80.0167, type: 'town' },
            { name: 'Kalpitiya', latitude: 8.2333, longitude: 79.7667, type: 'town' },
            { name: 'Mahawewa', latitude: 7.4833, longitude: 79.8333, type: 'town' },
            { name: 'Madampe', latitude: 7.5000, longitude: 79.8500, type: 'town' },
            { name: 'Mundel', latitude: 7.8000, longitude: 79.8167, type: 'town' },
            { name: 'Norochcholai', latitude: 8.1667, longitude: 79.7167, type: 'village' }
          ]
        }
      ]
    },
    {
      name: 'North Central Province',
      districts: [
        {
          name: 'Anuradhapura',
          localities: [
            { name: 'Anuradhapura', latitude: 8.3114, longitude: 80.4037, type: 'city' },
            { name: 'Kekirawa', latitude: 8.0333, longitude: 80.5833, type: 'town' },
            { name: 'Medawachchiya', latitude: 8.5333, longitude: 80.5000, type: 'town' },
            { name: 'Eppawala', latitude: 8.1500, longitude: 80.4167, type: 'town' },
            { name: 'Tambuttegama', latitude: 8.1667, longitude: 80.3000, type: 'town' },
            { name: 'Mihintale', latitude: 8.3500, longitude: 80.5000, type: 'town' },
            { name: 'Habarana', latitude: 8.0333, longitude: 80.7500, type: 'town' },
            { name: 'Nochchiyagama', latitude: 8.2667, longitude: 80.2167, type: 'town' },
            { name: 'Galnewa', latitude: 8.0000, longitude: 80.4500, type: 'town' },
            { name: 'Talawa', latitude: 8.2000, longitude: 80.3333, type: 'town' },
            { name: 'Horowpathana', latitude: 8.5833, longitude: 80.8667, type: 'town' },
            { name: 'Kahatagasdigiliya', latitude: 8.4333, longitude: 80.6833, type: 'town' }
          ]
        },
        {
          name: 'Polonnaruwa',
          localities: [
            { name: 'Polonnaruwa', latitude: 7.9403, longitude: 81.0188, type: 'city' },
            { name: 'Kaduruwela', latitude: 7.9333, longitude: 81.0167, type: 'town' },
            { name: 'Hingurakgoda', latitude: 8.0500, longitude: 80.9833, type: 'town' },
            { name: 'Medirigiriya', latitude: 8.1500, longitude: 81.0167, type: 'town' },
            { name: 'Minneriya', latitude: 8.0333, longitude: 80.9000, type: 'town' },
            { name: 'Giritale', latitude: 7.9833, longitude: 80.9167, type: 'village' },
            { name: 'Elahera', latitude: 7.7333, longitude: 80.8333, type: 'town' },
            { name: 'Welikanda', latitude: 7.9833, longitude: 81.2500, type: 'town' },
            { name: 'Aralaganwila', latitude: 7.8000, longitude: 81.1667, type: 'town' }
          ]
        }
      ]
    },
    {
      name: 'Uva Province',
      districts: [
        {
          name: 'Badulla',
          localities: [
            { name: 'Badulla', latitude: 6.9934, longitude: 81.0550, type: 'city' },
            { name: 'Bandarawela', latitude: 6.8259, longitude: 80.9982, type: 'town' },
            { name: 'Haputale', latitude: 6.7686, longitude: 80.9500, type: 'town' },
            { name: 'Ella', latitude: 6.8667, longitude: 81.0467, type: 'village' },
            { name: 'Welimada', latitude: 6.9000, longitude: 80.9167, type: 'town' },
            { name: 'Mahiyanganaya', latitude: 7.3167, longitude: 81.0000, type: 'town' },
            { name: 'Passara', latitude: 6.9333, longitude: 81.1500, type: 'town' },
            { name: 'Hali-Ela', latitude: 6.9500, longitude: 81.0333, type: 'town' },
            { name: 'Diyatalawa', latitude: 6.8167, longitude: 80.9667, type: 'town' },
            { name: 'Demodara', latitude: 6.9000, longitude: 81.0667, type: 'village' }
          ]
        },
        {
          name: 'Monaragala',
          localities: [
            { name: 'Monaragala', latitude: 6.8728, longitude: 81.3507, type: 'town' },
            { name: 'Wellawaya', latitude: 6.7333, longitude: 81.1000, type: 'town' },
            { name: 'Buttala', latitude: 6.7667, longitude: 81.2500, type: 'town' },
            { name: 'Kataragama', latitude: 6.4167, longitude: 81.3333, type: 'town' },
            { name: 'Bibile', latitude: 7.1667, longitude: 81.2333, type: 'town' },
            { name: 'Siyambalanduwa', latitude: 6.9000, longitude: 81.5500, type: 'town' },
            { name: 'Thanamalwila', latitude: 6.4333, longitude: 81.1333, type: 'town' }
          ]
        }
      ]
    },
    {
      name: 'Sabaragamuwa Province',
      districts: [
        {
          name: 'Ratnapura',
          localities: [
            { name: 'Ratnapura', latitude: 6.7056, longitude: 80.3847, type: 'city' },
            { name: 'Balangoda', latitude: 6.6494, longitude: 80.7003, type: 'town' },
            { name: 'Pelmadulla', latitude: 6.6167, longitude: 80.5500, type: 'town' },
            { name: 'Embilipitiya', latitude: 6.3333, longitude: 80.8500, type: 'town' },
            { name: 'Kuruwita', latitude: 6.7667, longitude: 80.3667, type: 'town' },
            { name: 'Eheliyagoda', latitude: 6.8500, longitude: 80.2667, type: 'town' },
            { name: 'Kahawatta', latitude: 6.5833, longitude: 80.5833, type: 'town' },
            { name: 'Rakwana', latitude: 6.4667, longitude: 80.6167, type: 'town' },
            { name: 'Nivithigala', latitude: 6.6000, longitude: 80.4500, type: 'town' },
            { name: 'Kalawana', latitude: 6.5333, longitude: 80.4000, type: 'town' },
            { name: 'Godakawela', latitude: 6.5333, longitude: 80.6167, type: 'town' }
          ]
        },
        {
          name: 'Kegalle',
          localities: [
            { name: 'Kegalle', latitude: 7.2514, longitude: 80.3464, type: 'city' },
            { name: 'Mawanella', latitude: 7.2528, longitude: 80.4472, type: 'town' },
            { name: 'Warakapola', latitude: 7.2242, longitude: 80.1989, type: 'town' },
            { name: 'Ruwanwella', latitude: 7.0500, longitude: 80.2500, type: 'town' },
            { name: 'Yatiyantota', latitude: 7.0333, longitude: 80.3000, type: 'town' },
            { name: 'Dehiowita', latitude: 6.9667, longitude: 80.2833, type: 'town' },
            { name: 'Deraniyagala', latitude: 6.9333, longitude: 80.3333, type: 'town' },
            { name: 'Rambukkana', latitude: 7.3167, longitude: 80.3833, type: 'town' },
            { name: 'Galigamuwa', latitude: 7.2167, longitude: 80.2833, type: 'town' },
            { name: 'Kitulgala', latitude: 6.9833, longitude: 80.4167, type: 'town' },
            { name: 'Aranayaka', latitude: 7.1500, longitude: 80.4667, type: 'town' }
          ]
        }
      ]
    },
    {
      name: 'Northern Province',
      districts: [
        {
          name: 'Jaffna',
          localities: [
            { name: 'Jaffna', latitude: 9.6615, longitude: 80.0255, type: 'city' },
            { name: 'Nallur', latitude: 9.6744, longitude: 80.0294, type: 'suburb' },
            { name: 'Chavakachcheri', latitude: 9.6542, longitude: 80.1583, type: 'town' },
            { name: 'Point Pedro', latitude: 9.8167, longitude: 80.2333, type: 'town' },
            { name: 'Karainagar', latitude: 9.7333, longitude: 79.8833, type: 'village' },
            { name: 'Chunnakam', latitude: 9.7500, longitude: 80.0167, type: 'town' },
            { name: 'Vaddukoddai', latitude: 9.7500, longitude: 79.9333, type: 'town' },
            { name: 'Manipay', latitude: 9.7167, longitude: 80.0000, type: 'town' },
            { name: 'Kopay', latitude: 9.7000, longitude: 80.0500, type: 'town' },
            { name: 'Tellippalai', latitude: 9.7833, longitude: 80.0333, type: 'town' },
            { name: 'Velanai', latitude: 9.6500, longitude: 79.9000, type: 'village' },
            { name: 'Kayts', latitude: 9.6833, longitude: 79.8667, type: 'town' }
          ]
        },
        {
          name: 'Kilinochchi',
          localities: [
            { name: 'Kilinochchi', latitude: 9.3803, longitude: 80.3986, type: 'town' },
            { name: 'Pallai', latitude: 9.5833, longitude: 80.3000, type: 'village' },
            { name: 'Pooneryn', latitude: 9.5000, longitude: 80.2000, type: 'village' },
            { name: 'Paranthan', latitude: 9.4333, longitude: 80.4000, type: 'town' }
          ]
        },
        {
          name: 'Mannar',
          localities: [
            { name: 'Mannar', latitude: 8.9814, longitude: 79.9042, type: 'city' },
            { name: 'Pesalai', latitude: 9.0833, longitude: 79.8167, type: 'village' },
            { name: 'Talaimannar', latitude: 9.1000, longitude: 79.7167, type: 'town' },
            { name: 'Murunkan', latitude: 8.8333, longitude: 80.0333, type: 'village' },
            { name: 'Madhu', latitude: 8.8500, longitude: 80.2000, type: 'village' }
          ]
        },
        {
          name: 'Vavuniya',
          localities: [
            { name: 'Vavuniya', latitude: 8.7514, longitude: 80.4971, type: 'city' },
            { name: 'Cheddikulam', latitude: 8.6667, longitude: 80.3000, type: 'town' },
            { name: 'Nedunkeni', latitude: 8.9667, longitude: 80.6500, type: 'village' },
            { name: 'Omanthai', latitude: 8.8667, longitude: 80.4833, type: 'village' }
          ]
        },
        {
          name: 'Mullaitivu',
          localities: [
            { name: 'Mullaitivu', latitude: 9.2671, longitude: 81.2944, type: 'town' },
            { name: 'Puthukkudiyiruppu', latitude: 9.3167, longitude: 80.6000, type: 'town' },
            { name: 'Oddusuddan', latitude: 9.1500, longitude: 80.5500, type: 'village' },
            { name: 'Mankulam', latitude: 9.1333, longitude: 80.4500, type: 'town' }
          ]
        }
      ]
    },
    {
      name: 'Eastern Province',
      districts: [
        {
          name: 'Trincomalee',
          localities: [
            { name: 'Trincomalee', latitude: 8.5874, longitude: 81.2152, type: 'city' },
            { name: 'Kinniya', latitude: 8.5000, longitude: 81.1833, type: 'town' },
            { name: 'Mutur', latitude: 8.4500, longitude: 81.2667, type: 'town' },
            { name: 'Nilaveli', latitude: 8.6833, longitude: 81.1833, type: 'village' },
            { name: 'Kantale', latitude: 8.3667, longitude: 80.9833, type: 'town' },
            { name: 'Kuchchaveli', latitude: 8.8167, longitude: 81.1000, type: 'village' },
            { name: 'Seruvila', latitude: 8.3500, longitude: 81.3167, type: 'village' }
          ]
        },
        {
          name: 'Batticaloa',
          localities: [
            { name: 'Batticaloa', latitude: 7.7310, longitude: 81.6747, type: 'city' },
            { name: 'Eravur', latitude: 7.7833, longitude: 81.6000, type: 'town' },
            { name: 'Kattankudy', latitude: 7.6833, longitude: 81.7167, type: 'town' },
            { name: 'Valaichchenai', latitude: 7.9167, longitude: 81.5333, type: 'town' },
            { name: 'Chenkalady', latitude: 7.8000, longitude: 81.5667, type: 'town' },
            { name: 'Kaluwanchikudy', latitude: 7.5333, longitude: 81.7833, type: 'town' },
            { name: 'Oddamavadi', latitude: 7.9167, longitude: 81.5167, type: 'town' }
          ]
        },
        {
          name: 'Ampara',
          localities: [
            { name: 'Ampara', latitude: 7.2912, longitude: 81.6724, type: 'city' },
            { name: 'Kalmunai', latitude: 7.4167, longitude: 81.8167, type: 'city' },
            { name: 'Sammanthurai', latitude: 7.3667, longitude: 81.8000, type: 'town' },
            { name: 'Akkaraipattu', latitude: 7.2167, longitude: 81.8500, type: 'town' },
            { name: 'Pottuvil', latitude: 6.8667, longitude: 81.8333, type: 'town' },
            { name: 'Arugam Bay', latitude: 6.8417, longitude: 81.8333, type: 'village' },
            { name: 'Sainthamaruthu', latitude: 7.4000, longitude: 81.8333, type: 'town' },
            { name: 'Uhana', latitude: 7.3333, longitude: 81.6000, type: 'town' },
            { name: 'Dehiattakandiya', latitude: 7.6833, longitude: 81.0500, type: 'town' }
          ]
        }
      ]
    }
  ],

  // 🇦🇺 AUSTRALIA
  'AU': [
    {
      name: 'Victoria',
      districts: [
        {
          name: 'Greater Melbourne',
          localities: [
            { name: 'Melbourne CBD', latitude: -37.8136, longitude: 144.9631, type: 'city' },
            { name: 'Dandenong', latitude: -37.9810, longitude: 145.2150, type: 'suburb' },
            { name: 'Clayton', latitude: -37.9150, longitude: 145.1200, type: 'suburb' },
            { name: 'Glen Waverley', latitude: -37.8800, longitude: 145.1600, type: 'suburb' },
            { name: 'Berwick', latitude: -38.0300, longitude: 145.3400, type: 'suburb' },
            { name: 'Werribee', latitude: -37.9000, longitude: 144.6600, type: 'suburb' }
          ]
        }
      ]
    },
    {
      name: 'New South Wales',
      districts: [
        {
          name: 'Greater Sydney',
          localities: [
            { name: 'Sydney CBD', latitude: -33.8688, longitude: 151.2093, type: 'city' },
            { name: 'Parramatta', latitude: -33.8150, longitude: 151.0011, type: 'city' },
            { name: 'Blacktown', latitude: -33.7710, longitude: 150.9063, type: 'suburb' },
            { name: 'Chatswood', latitude: -33.7961, longitude: 151.1781, type: 'suburb' },
            { name: 'Strathfield', latitude: -33.8800, longitude: 151.0930, type: 'suburb' },
            { name: 'Bondi', latitude: -33.8915, longitude: 151.2767, type: 'suburb' }
          ]
        }
      ]
    },
    {
      name: 'Queensland',
      districts: [
        {
          name: 'Brisbane Region',
          localities: [
            { name: 'Brisbane', latitude: -27.4698, longitude: 153.0251, type: 'city' },
            { name: 'Gold Coast', latitude: -28.0167, longitude: 153.4000, type: 'city' },
            { name: 'Sunshine Coast', latitude: -26.6500, longitude: 153.0667, type: 'city' }
          ]
        }
      ]
    },
    {
      name: 'Western Australia',
      districts: [
        {
          name: 'Perth Region',
          localities: [
            { name: 'Perth', latitude: -31.9505, longitude: 115.8605, type: 'city' },
            { name: 'Fremantle', latitude: -32.0569, longitude: 115.7439, type: 'city' }
          ]
        }
      ]
    }
  ],

  // 🇬🇧 UNITED KINGDOM
  'GB': [
    {
      name: 'England',
      districts: [
        {
          name: 'Greater London',
          localities: [
            { name: 'City of London', latitude: 51.5128, longitude: -0.0918, type: 'city' },
            { name: 'Westminster', latitude: 51.4975, longitude: -0.1357, type: 'city' },
            { name: 'Camden', latitude: 51.5290, longitude: -0.1255, type: 'town' },
            { name: 'Kensington', latitude: 51.5014, longitude: -0.1919, type: 'town' },
            { name: 'Greenwich', latitude: 51.4826, longitude: -0.0077, type: 'town' },
            { name: 'Croydon', latitude: 51.3762, longitude: -0.0982, type: 'town' }
          ]
        },
        {
          name: 'Greater Manchester',
          localities: [
            { name: 'Manchester', latitude: 53.4808, longitude: -2.2426, type: 'city' },
            { name: 'Salford', latitude: 53.4875, longitude: -2.2901, type: 'city' },
            { name: 'Bolton', latitude: 53.5769, longitude: -2.4282, type: 'town' }
          ]
        },
        {
          name: 'West Midlands',
          localities: [
            { name: 'Birmingham', latitude: 52.4862, longitude: -1.8904, type: 'city' },
            { name: 'Coventry', latitude: 52.4068, longitude: -1.5197, type: 'city' }
          ]
        }
      ]
    },
    {
      name: 'Scotland',
      districts: [
        {
          name: 'Lothian & Strathclyde',
          localities: [
            { name: 'Edinburgh', latitude: 55.9533, longitude: -3.1883, type: 'city' },
            { name: 'Glasgow', latitude: 55.8642, longitude: -4.2518, type: 'city' },
            { name: 'Aberdeen', latitude: 57.1497, longitude: -2.0943, type: 'city' }
          ]
        }
      ]
    }
  ],

  // 🇺🇸 UNITED STATES
  'US': [
    {
      name: 'California',
      districts: [
        {
          name: 'San Francisco Bay Area',
          localities: [
            { name: 'San Francisco', latitude: 37.7749, longitude: -122.4194, type: 'city' },
            { name: 'San Jose', latitude: 37.3382, longitude: -121.8863, type: 'city' },
            { name: 'Oakland', latitude: 37.8044, longitude: -122.2712, type: 'city' },
            { name: 'Palo Alto', latitude: 37.4419, longitude: -122.1430, type: 'city' },
            { name: 'Berkeley', latitude: 37.8715, longitude: -122.2730, type: 'city' }
          ]
        },
        {
          name: 'Los Angeles County',
          localities: [
            { name: 'Los Angeles', latitude: 34.0522, longitude: -118.2437, type: 'city' },
            { name: 'Pasadena', latitude: 34.1478, longitude: -118.1445, type: 'city' },
            { name: 'Long Beach', latitude: 33.7701, longitude: -118.1937, type: 'city' },
            { name: 'Santa Monica', latitude: 34.0195, longitude: -118.4912, type: 'city' }
          ]
        }
      ]
    },
    {
      name: 'New York',
      districts: [
        {
          name: 'New York City',
          localities: [
            { name: 'Manhattan', latitude: 40.7831, longitude: -73.9712, type: 'suburb' },
            { name: 'Brooklyn', latitude: 40.6782, longitude: -73.9442, type: 'suburb' },
            { name: 'Queens', latitude: 40.7282, longitude: -73.7949, type: 'suburb' },
            { name: 'Staten Island', latitude: 40.5795, longitude: -74.1502, type: 'suburb' },
            { name: 'The Bronx', latitude: 40.8448, longitude: -73.8648, type: 'suburb' }
          ]
        }
      ]
    },
    {
      name: 'Massachusetts',
      districts: [
        {
          name: 'Greater Boston',
          localities: [
            { name: 'Boston', latitude: 42.3601, longitude: -71.0589, type: 'city' },
            { name: 'Cambridge', latitude: 42.3736, longitude: -71.1097, type: 'city' },
            { name: 'Quincy', latitude: 42.2529, longitude: -71.0023, type: 'city' }
          ]
        }
      ]
    }
  ],

  // 🇨🇦 CANADA
  'CA': [
    {
      name: 'Ontario',
      districts: [
        {
          name: 'Greater Toronto Area',
          localities: [
            { name: 'Toronto', latitude: 43.6532, longitude: -79.3832, type: 'city' },
            { name: 'Mississauga', latitude: 43.5890, longitude: -79.6441, type: 'city' },
            { name: 'Brampton', latitude: 43.7315, longitude: -79.7624, type: 'city' },
            { name: 'Markham', latitude: 43.8561, longitude: -79.3370, type: 'city' },
            { name: 'Scarborough', latitude: 43.7764, longitude: -79.2318, type: 'suburb' }
          ]
        }
      ]
    },
    {
      name: 'British Columbia',
      districts: [
        {
          name: 'Metro Vancouver',
          localities: [
            { name: 'Vancouver', latitude: 49.2827, longitude: -123.1207, type: 'city' },
            { name: 'Burnaby', latitude: 49.2488, longitude: -122.9805, type: 'city' },
            { name: 'Richmond', latitude: 49.1666, longitude: -123.1336, type: 'city' },
            { name: 'Surrey', latitude: 49.1913, longitude: -122.8490, type: 'city' }
          ]
        }
      ]
    }
  ]
};

export function getRegionsByCountry(countryCode: string): RegionItem[] {
  return DIVISIONS_DATA[countryCode.toUpperCase()] || [];
}
