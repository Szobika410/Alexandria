import { useState, useEffect } from "react";
import { ArrowLeft, Globe, DollarSign, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { countries, Country, getCurrentCountry, setCurrentCountry, getTranslation } from "@/utils/internationalization";
import BottomNavBar from "@/components/BottomNavBar";

const Settings = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { user } = useUser();
  const [selectedCountry, setSelectedCountryState] = useState<Country>(getCurrentCountry());

  const handleCountryChange = (country: Country) => {
    setSelectedCountryState(country);
    setCurrentCountry(country);
  };

  const t = (key: string) => getTranslation(key, selectedCountry.language);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{t('settings')}</h1>
        </div>
      </div>

      <div className="p-4 pb-20">
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Country Selection */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-5 h-5 text-gray-600" />
                <h3 className="font-medium text-gray-900">{t('country')}</h3>
              </div>
            </div>
              <div className="space-y-2">
                {countries.map((country) => (
                  <Button
                    key={country.code}
                    variant={selectedCountry.code === country.code ? "default" : "outline"}
                    className={`w-full justify-start ${
                      selectedCountry.code === country.code 
                        ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleCountryChange(country)}
                  >
                    <span className="mr-2">{country.flag}</span>
                    {country.name}
                  </Button>
                ))}
              </div>
            <div className="space-y-2">
              {countries.map((country) => (
                <Button
                  key={country.code}
                  variant={selectedCountry.code === country.code ? "default" : "outline"}
                  className={`w-full justify-start ${
                    selectedCountry.code === country.code 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleCountryChange(country)}
                >
                  <span className="mr-2">{country.flag}</span>
                  {country.name}
                </Button>
              ))}
            </div>
          </div>

        </div>

        {/* Additional Settings */}
        <div className="bg-white rounded-lg border border-gray-200 mt-4 p-4">
          <h3 className="font-medium text-gray-900 mb-3">{t('accountSettings')}</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              {t('notifications')}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              {t('privacy')}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              {t('helpAndSupport')}
            </Button>
          </div>
          {user && (
            <div
              className="bg-white p-4 rounded-lg shadow-sm cursor-pointer"
              onClick={() => {
                signOut();
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ArrowLeft className="w-5 h-5 text-red-500" />
                  <span className="text-gray-900">{t('logout')}</span>
                </div>
                <ArrowLeft className="w-5 h-5 rotate-180 text-gray-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
};

export default Settings;