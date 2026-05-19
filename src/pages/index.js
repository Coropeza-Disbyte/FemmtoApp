// Auth
const WelcomePage                = require('./welcome/WelcomePage');
const LoginPage                  = require('./auth/LoginPage');
const SignUpPage                  = require('./auth/SignUpPage');
const ResetPasswordPage          = require('./auth/ResetPasswordPage');
const NotificationPermissionPage = require('./auth/NotificationPermissionPage');
const MeetUserPage               = require('./auth/MeetUserPage');
const SaveOnboardingProgressPage = require('./auth/SaveOnboardingProgressPage');

// Onboarding
const SetNamePage                = require('./onboarding/SetNamePage');
const SetBirthdatePage           = require('./onboarding/SetBirthdatePage');
const SetGenderPage              = require('./onboarding/SetGenderPage');
const SetWeightPage              = require('./onboarding/SetWeightPage');
const SetHeightPage              = require('./onboarding/SetHeightPage');
const SetPicturePage             = require('./onboarding/SetPicturePage');

// Home + Tabs
const HomePage                   = require('./home/HomePage');
const DevicesPage                = require('./tabs/DevicesPage');
const MeditionPage               = require('./tabs/MeditionPage');
const RemindersPage              = require('./tabs/RemindersPage');
const SharePage                  = require('./tabs/SharePage');

// Profile
const ProfilePage                = require('./profile/ProfilePage');
const MenuPage                   = require('./profile/MenuPage');

// Metrics — Details
const WeightDetailsPage          = require('./metrics/WeightDetailsPage');
const PresureDetailsPage         = require('./metrics/PresureDetailsPage');
const GlucoseDetailsPage         = require('./metrics/GlucoseDetailsPage');
const HeartRateDetailsPage       = require('./metrics/HeartRateDetailsPage');
const StepsDetailsPage           = require('./metrics/StepsDetailsPage');
const MetabolismDetailsPage      = require('./metrics/MetabolismDetailsPage');

// Metrics — History
const WeightHistoryPage          = require('./metrics/WeightHistoryPage');
const GlucoseHistoryPage         = require('./metrics/GlucoseHistoryPage');
const HeartRateHistoryPage       = require('./metrics/HeartRateHistoryPage');
const PresureHistoryPage         = require('./metrics/PresureHistoryPage');
const StepsHistoryPage           = require('./metrics/StepsHistoryPage');

// Medition flows
const AddGlucosePage             = require('./medition/AddGlucosePage');
const NewGlucometerPage          = require('./medition/NewGlucometerPage');
const NewPresurePage             = require('./medition/NewPresurePage');
const NewScalePage               = require('./medition/NewScalePage');
const FirstMeasurePage           = require('./medition/FirstMeasurePage');

module.exports = {
  // Auth
  WelcomePage,
  LoginPage,
  SignUpPage,
  ResetPasswordPage,
  NotificationPermissionPage,
  MeetUserPage,
  SaveOnboardingProgressPage,
  // Onboarding
  SetNamePage,
  SetBirthdatePage,
  SetGenderPage,
  SetWeightPage,
  SetHeightPage,
  SetPicturePage,
  // Home + Tabs
  HomePage,
  DevicesPage,
  MeditionPage,
  RemindersPage,
  SharePage,
  // Profile
  ProfilePage,
  MenuPage,
  // Metrics — Details
  WeightDetailsPage,
  PresureDetailsPage,
  GlucoseDetailsPage,
  HeartRateDetailsPage,
  StepsDetailsPage,
  MetabolismDetailsPage,
  // Metrics — History
  WeightHistoryPage,
  GlucoseHistoryPage,
  HeartRateHistoryPage,
  PresureHistoryPage,
  StepsHistoryPage,
  // Medition flows
  AddGlucosePage,
  NewGlucometerPage,
  NewPresurePage,
  NewScalePage,
  FirstMeasurePage,
};
