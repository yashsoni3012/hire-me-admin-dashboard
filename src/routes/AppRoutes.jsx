import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

// Pages
import Login from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import Dashboard from "../pages/Dashboard/Dashboard";

// Unknown
// import Users from "../pages/Users/Users";
import Permissions from "../pages/Permissions/Permissions";
import Category from "../pages/Category/Category";
import Blogs from "../pages/Blogs/Blogs";

// Yash modules
import Roles from "../pages/Roles/Roles";
import Skills from "../pages/skills/Skills";
import Module from "../pages/module/Module";
import Candidates from "../pages/candidates/Candidates";
import Company from "../pages/company/Company";
import Profile from "../pages/Profile/Profile";
import Jobs from "../pages/Jobs/Jobs";
import JobsForm from "../pages/Jobs/JobsForm";

// Divyesh modules
import Industry from "../pages/Industry/Industry";
import IndustryForm from "../pages/Industry/IndustryForm";
import SubIndustry from "../pages/SubIndustry/SubIndustry";
import SubIndustryForm from "../pages/SubIndustry/SubIndustryForm";
import EducationCategory from "../pages/EducationCategory/EducationCategory";
import EducationCategoryForm from "../pages/EducationCategory/EducationCategoryForm";
import EducationSubCategory from "../pages/EducationSubCategory/EducationSubCategory";
import FunctionRoleCategory from "../pages/FunctionRoleCategory/FunctionRoleCategory";
import FunctionRoles from "../pages/FunctionRoles/FunctionRoles";
import PerkBenefitCategory from "../pages/PerkBenefitCategory/PerkBenefitCategory";
import PerkBenefit from "../pages/PerkBenefit/PerkBenefit";
import JobCategory from "../pages/JobCategory/JobCategory";
import JobSubCategory from "../pages/JobSubCategory/JobSubCategory";
import SubscriptionFeatures from "../pages/SubscriptionFeatures/SubscriptionFeatures";
import SubscriptionFeatureCategories from "../pages/SubscriptionFeatureCategories/SubscriptionFeatureCategories";
import SubscriptionTransactions from "../pages/SubscriptionTransactions/SubscriptionTransactions";
import SubscriptionPlanOffers from "../pages/SubscriptionPlanOffers/SubscriptionPlanOffers";
import Invoices from "../pages/Invoices/Invoices";

// Tanvi modules

import State from "../pages/State/State";
import AddState from "../pages/State/AddState";
import EditState from "../pages/State/EditState";
import ViewState from "../pages/State/ViewState";

import City from "../pages/City/City";
import AddCity from "../pages/City/AddCity";
import EditCity from "../pages/City/EditCity";
import ViewCity from "../pages/City/ViewCity";

import DemoRequest from "../pages/DemoRequests/DemoRequests";
import AddDemoRequest from "../pages/DemoRequests/AddDemoRequests";
import EditDemoRequest from "../pages/DemoRequests/EditDemoRequests";
import ViewDemoRequest from "../pages/DemoRequests/ViewDemoRequests";

import Language from "../pages/Language/Language";
import Department from "../pages/Department/Department";
import Currency from "../pages/Currency/Currency";
import BillingRate from "../pages/BillingRate/BillingRate";
import Banners from "../pages/Banner/Banners";
import ExperienceLevels from "../pages/ExperienceLevels/ExperienceLevels";
import WorkplaceType from "../pages/WorkplaceType/WorkplaceType";
import ApplicationStatus from "../pages/ApplicationStatus/ApplicationStatus";
import CompanyTestimonials from "../pages/CompanyTestimonials/CompanyTestimonials";
import SubscriptionPlans from "../pages/SubscriptionPlans/SubscriptionPlans";
import SubscriptionPlanFeatures from "../pages/SubscriptionPlanFeatures/SubscriptionPlanFeatures";
import SubscriptionCoupons from "../pages/SubscriptionCoupons/SubscriptionCoupons";
import CompanySubscriptions from "../pages/CompanySubscriptions/CompanySubscriptions";
import SubscriptionRenewalLogs from "../pages/SubscriptionRenewalLogs/SubscriptionRenewalLogs";
import Users from "../pages/Users/Users";

// Sharddha modules
import Settings from "../pages/Settings/Settings";
import NoticePeriod from "../pages/NoticePeriod/NoticePeriod";
import CompanyType from "../pages/CompanyType/CompanyType";
import CompanySize from "../pages/CompanySize/CompanySize";

import AddLanguage from "../pages/Language/AddLanguage";
import EditLanguage from "../pages/Language/EditLanguage";
import ViewLanguage from "../pages/Language/ViewLanguage";
import AddDepartment from "../pages/Department/AddDepartment";
import EditDepartment from "../pages/Department/EditDepartment";
import ViewDepartment from "../pages/Department/ViewDepartment";
import AddCurrency from "../pages/Currency/AddCurrency";
import EditCurrency from "../pages/Currency/EditCurrency";
import ViewCurrency from "../pages/Currency/ViewCurrency";
import AddBillingRate from "../pages/BillingRate/AddBillingRate";
import EditBillingRate from "../pages/BillingRate/EditBillingRate";
import ViewBillingRate from "../pages/BillingRate/ViewBillingRate";
import AddBanner from "../pages/Banner/AddBanner";
import EditBanner from "../pages/Banner/EditBanner";
import ViewBanner from "../pages/Banner/ViewBanner";
import AddExperienceLevel from "../pages/ExperienceLevels/AddExperienceLevel";
import EditExperienceLevel from "../pages/ExperienceLevels/EditExperienceLevel";
import ViewExperienceLevel from "../pages/ExperienceLevels/ViewExperienceLevel";
import AddWorkplaceType from "../pages/WorkplaceType/AddWorkplaceType";
import EditWorkplaceType from "../pages/WorkplaceType/EditWorkplaceType";
import ViewWorkplaceType from "../pages/WorkplaceType/ViewWorkplaceType";
import AddApplicationStatus from "../pages/ApplicationStatus/AddApplicationStatus";
import EditApplicationStatus from "../pages/ApplicationStatus/EditApplicationStatus";
import ViewApplicationStatus from "../pages/ApplicationStatus/ViewApplicationStatus";
import AddCompanyTestimonial from "../pages/CompanyTestimonials/AddCompanyTestimonial";
import EditCompanyTestimonial from "../pages/CompanyTestimonials/EditCompanyTestimonial";
import ViewCompanyTestimonial from "../pages/CompanyTestimonials/ViewCompanyTestimonial";
import AddSubscriptionPlan from "../pages/SubscriptionPlans/AddSubscriptionPlan";
// import EditSubscriptionPlan from "../pages/SubscriptionPlans/EditSubscriptionPlan";
// import ViewSubscriptionPlan from "../pages/SubscriptionPlans/ViewSubscriptionPlan";
import AddSubscriptionCoupon from "../pages/SubscriptionCoupons/AddSubscriptionCoupon";
import EditSubscriptionCoupon from "../pages/SubscriptionCoupons/EditSubscriptionCoupon";
import ViewSubscriptionCoupon from "../pages/SubscriptionCoupons/ViewSubscriptionCoupon";
import AddCompanySubscription from "../pages/CompanySubscriptions/AddCompanySubscription";
import EditCompanySubscription from "../pages/CompanySubscriptions/EditCompanySubscription";
import ViewCompanySubscription from "../pages/CompanySubscriptions/ViewCompanySubscription";
import AddSubscriptionRenewalLog from "../pages/SubscriptionRenewalLogs/AddSubscriptionRenewalLog";
import EditSubscriptionRenewalLog from "../pages/SubscriptionRenewalLogs/EditSubscriptionRenewalLog";
import ViewSubscriptionRenewalLog from "../pages/SubscriptionRenewalLogs/ViewSubscriptionRenewalLog";
import AddUser from "../pages/Users/AddUser";
import EditUser from "../pages/Users/EditUser";
import ViewUser from "../pages/Users/ViewUser";
import AddNoticePeriod from "../pages/NoticePeriod/AddNoticePeriod";
import EditNoticePeriod from "../pages/NoticePeriod/EditNoticePeriod";
import ViewNoticePeriod from "../pages/NoticePeriod/ViewNoticePeriod";
import AddCompanyType from "../pages/CompanyType/AddCompanyType";
import EditCompanyType from "../pages/CompanyType/EditCompanyType";
import ViewCompanyType from "../pages/CompanyType/ViewCompanyType";
import AddCompanySize from "../pages/CompanySize/AddCompanySize";
import EditCompanySize from "../pages/CompanySize/EditCompanySize";
import ViewCompanySize from "../pages/CompanySize/ViewCompanySize";
import AddRole from "../pages/Roles/AddRole";
import EditRole from "../pages/Roles/EditRole";
import ViewRole from "../pages/Roles/ViewRole";
import AddSkill from "../pages/skills/AddSkill";
import EditSkill from "../pages/skills/EditSkill";
import ViewSkill from "../pages/skills/ViewSkill";
import JobTypes from "../pages/JobTypes/JobTypes";
import AddJobType from "../pages/JobTypes/AddJobType";
import EditJobType from "../pages/JobTypes/EditJobType";
import ViewJobType from "../pages/JobTypes/ViewJobType";
import SubscriptionPlansFeatures from "../pages/SubscriptionPlans/SubscriptionPlanFeatures";
import AddCompany from "../pages/company/AddCompany";
import EditCompany from "../pages/company/EditCompany";
import ViewCompany from "../pages/company/ViewCompany";

import EducationSubCategoryForm from "../pages/EducationSubCategory/EducationSubCategoryForm";
import PerkBenefitForm from "../pages/PerkBenefit/PerkBenefitForm";
import PerkBenefitCategoryForm from "../pages/PerkBenefitCategory/PerkBenefitCategoryForm";
import FunctionRoleCategoryForm from "../pages/FunctionRoleCategory/FunctionRoleCategoryForm";
import FunctionRolesForm from "../pages/FunctionRoles/FunctionRolesForm";
import JobCategoryForm from "../pages/JobCategory/JobCategoryForm";
import JobSubCategoryForm from "../pages/JobSubCategory/JobSubCategoryForm";
import SubscriptionFeaturesForm from "../pages/SubscriptionFeatures/SubscriptionFeaturesForm";
import SubscriptionFeatureCategoriesForm from "../pages/SubscriptionFeatureCategories/SubscriptionFeatureCategoriesForm";
import SubscriptionTransactionsForm from "../pages/SubscriptionTransactions/SubscriptionTransactionsForm";
import SubscriptionPlanOffersForm from "../pages/SubscriptionPlanOffers/SubscriptionPlanOffersForm";
import InvoicesForm from "../pages/Invoices/InvoicesForm";
import SubscriptionPlanFeaturesForm from "../pages/SubscriptionPlanFeatures/SubscriptionPlanFeaturesForm";
import SubscriptionPlanFeatureBulkAdd from "../pages/SubscriptionPlanFeatures/SubscriptionPlanFeatureBulkAdd";
import CandidatesView from "../pages/candidates/CandidatesView";
import SubscriptionPlansForm from "../pages/SubscriptionPlans/SubscriptionPlansForm";
import ProjectSettings from "../pages/ProjectSettings/ProjectSettings";
import AddProjectSettings from "../pages/ProjectSettings/AddProjectSettings";
import EditProjectSettings from "../pages/ProjectSettings/EditProjectSettings";
import ViewProjectSettings from "../pages/ProjectSettings/ViewProjectSettings";
import ContactList from "../pages/Contact/ContactList";
import ContactView from "../pages/Contact/ContactView";
import ContactEdit from "../pages/Contact/ContactEdit";
import Cms_pages from "../pages/Cms/Cms_pages";
import CmsPageForm from "../pages/Cms/CmsPageForm";
import CandidateTestimonial from "../pages/CandidateTestimonials/CandidateTestimonials";
import AddCandidateTestimonial from "../pages/CandidateTestimonials/AddCandidateTestimonial";
import EditCandidateTestimonial from "../pages/CandidateTestimonials/EditCandidateTestimonial";
import ViewCandidateTestimonial from "../pages/CandidateTestimonials/ViewCandidateTestimonial";
import CandidateFaq from "../pages/CandidateFaq/CandidateFaq";
import AddCandidateFaq from "../pages/CandidateFaq/AddCandidateFaq";
import EditCandidateFaq from "../pages/CandidateFaq/EditCandidateFaq";
import ViewCandidateFaq from "../pages/CandidateFaq/ViewCandidateFaq";
import CompanyFaq from "../pages/CompanyFaq/CompanyFaq";
import AddCompanyFaq from "../pages/CompanyFaq/AddCompanyFaq";
import EditCompanyFaq from "../pages/CompanyFaq/EditCompanyFaq";
import ViewCompanyFaq from "../pages/CompanyFaq/ViewCompanyFaq";
import Salary from "../pages/Salary/Salary";
import AddSalary from "../pages/Salary/AddSalary";
import EditSalary from "../pages/Salary/EditSalary";
import ViewSalary from "../pages/Salary/ViewSalary";
import SubscriptionPlanFeatureBulkEdit from "../pages/SubscriptionPlanFeatures/SubscriptionPlanFeatureBulkEdit";
const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Public */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Private */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          {/* Unknown */}
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/users" element={<Users />} />
          <Route path="/users/add" element={<AddUser />} />
          <Route path="/users/edit/:id" element={<EditUser />} />
          <Route path="/users/view/:id" element={<ViewUser />} />

          <Route path="/permissions" element={<Permissions />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/category" element={<Category />} />

          {/* Yash modules */}
          <Route path="/roles" element={<Roles />} />
          <Route path="/roles/add" element={<AddRole />} />
          <Route path="/roles/edit/:id" element={<EditRole />} />
          <Route path="/roles/view/:id" element={<ViewRole />} />

          <Route path="/candidates" element={<Candidates />} />
          <Route path="/candidates/view/:id" element={<CandidatesView />} />
          {/* <Route path="/candidates/add" element={<CandidatesForm />} />
          <Route path="/candidates/edit/:id" element={<CandidatesForm />} />
          <Route path="/candidates/view/:id" element={<CandidatesForm />} /> */}

          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/add" element={<JobsForm />} />
          <Route path="/jobs/edit/:id" element={<JobsForm />} />
          <Route path="/jobs/view/:id" element={<JobsForm />} />

          <Route path="/candidates" element={<Candidates />} />

          <Route path="/companies" element={<Company />} />
          <Route path="/companies/add" element={<AddCompany />} />
          <Route path="/companies/edit/:id" element={<EditCompany />} />
          <Route path="/companies/view/:id" element={<ViewCompany />} />

          <Route path="/skills" element={<Skills />} />
          <Route path="/skills/add" element={<AddSkill />} />
          <Route path="/skills/edit/:id" element={<EditSkill />} />
          <Route path="/skills/view/:id" element={<ViewSkill />} />

          <Route path="/job-types" element={<JobTypes />} />
          <Route path="/job-types/add" element={<AddJobType />} />
          <Route path="/job-types/edit/:id" element={<EditJobType />} />
          <Route path="/job-types/view/:id" element={<ViewJobType />} />

          {/* CMS Pages */}
          <Route path="/cms-pages" element={<Cms_pages />} />
          <Route path="/cms-pages/add" element={<CmsPageForm />} />
          <Route path="/cms-pages/edit/:id" element={<CmsPageForm />} />
          <Route path="/cms-pages/view/:id" element={<CmsPageForm />} />

          <Route path="/industries" element={<Industry />} />
          <Route path="/industries/add" element={<IndustryForm />} />
          <Route path="/industries/edit/:id" element={<IndustryForm />} />
          <Route path="/industries/view/:id" element={<IndustryForm />} />

          <Route path="/subindustries" element={<SubIndustry />} />
          <Route path="/subindustries/add" element={<SubIndustryForm />} />
          <Route path="/subindustries/edit/:id" element={<SubIndustryForm />} />
          <Route path="/subindustries/view/:id" element={<SubIndustryForm />} />

          <Route path="/education-categories" element={<EducationCategory />} />
          <Route
            path="/education-categories/add"
            element={<EducationCategoryForm />}
          />
          <Route
            path="/education-categories/edit/:id"
            element={<EducationCategoryForm />}
          />
          <Route
            path="/education-categories/view/:id"
            element={<EducationCategoryForm />}
          />

          <Route
            path="/education-subcategories"
            element={<EducationSubCategory />}
          />
          <Route
            path="/education-subcategories/add"
            element={<EducationSubCategoryForm />}
          />
          <Route
            path="/education-subcategories/edit/:id"
            element={<EducationSubCategoryForm />}
          />
          <Route
            path="/education-subcategories/view/:id"
            element={<EducationSubCategoryForm />}
          />

          <Route path="/perk-benefits" element={<PerkBenefit />} />
          <Route path="/perk-benefits/add" element={<PerkBenefitForm />} />
          <Route path="/perk-benefits/edit/:id" element={<PerkBenefitForm />} />
          <Route path="/perk-benefits/view/:id" element={<PerkBenefitForm />} />

          <Route
            path="/perk-benefit-categories"
            element={<PerkBenefitCategory />}
          />
          <Route
            path="/perk-benefit-categories/add"
            element={<PerkBenefitCategoryForm />}
          />
          <Route
            path="/perk-benefit-categories/edit/:id"
            element={<PerkBenefitCategoryForm />}
          />
          <Route
            path="/perk-benefit-categories/view/:id"
            element={<PerkBenefitCategoryForm />}
          />

          <Route
            path="/function-role-categories"
            element={<FunctionRoleCategory />}
          />
          <Route
            path="/function-role-categories/add"
            element={<FunctionRoleCategoryForm />}
          />
          <Route
            path="/function-role-categories/edit/:id"
            element={<FunctionRoleCategoryForm />}
          />
          <Route
            path="/function-role-categories/view/:id"
            element={<FunctionRoleCategoryForm />}
          />

          <Route path="/function-roles" element={<FunctionRoles />} />
          <Route path="/function-roles/add" element={<FunctionRolesForm />} />
          <Route
            path="/function-roles/edit/:id"
            element={<FunctionRolesForm />}
          />
          <Route
            path="/function-roles/view/:id"
            element={<FunctionRolesForm />}
          />

          {/* <Route path="/job-categories" element={<JobCategory />} />
          <Route path="/job-categories/add" element={<JobCategoryForm />} />
          <Route
            path="/job-categories/edit/:id"
            element={<JobCategoryForm />}
          />
          <Route
            path="/job-categories/view/:id"
            element={<JobCategoryForm />}
          /> */}

          {/* <Route path="/job-subcategories" element={<JobSubCategory />} />
          <Route
            path="/job-subcategories/add"
            element={<JobSubCategoryForm />}
          />
          <Route
            path="/job-subcategories/edit/:id"
            element={<JobSubCategoryForm />}
          />
          <Route
            path="/job-subcategories/view/:id"
            element={<JobSubCategoryForm />}
          /> */}

          <Route
            path="/subscription-features"
            element={<SubscriptionFeatures />}
          />
          <Route
            path="/subscription-features/add"
            element={<SubscriptionFeaturesForm />}
          />
          <Route
            path="/subscription-features/edit/:id"
            element={<SubscriptionFeaturesForm />}
          />
          <Route
            path="/subscription-features/view/:id"
            element={<SubscriptionFeaturesForm />}
          />

          <Route
            path="/subscription-feature-categories"
            element={<SubscriptionFeatureCategories />}
          />
          <Route
            path="/subscription-feature-categories/add"
            element={<SubscriptionFeatureCategoriesForm />}
          />
          <Route
            path="/subscription-feature-categories/edit/:id"
            element={<SubscriptionFeatureCategoriesForm />}
          />
          <Route
            path="/subscription-feature-categories/view/:id"
            element={<SubscriptionFeatureCategoriesForm />}
          />

          <Route
            path="/subscription-transactions"
            element={<SubscriptionTransactions />}
          />
          <Route
            path="/subscription-transactions/view/:id"
            element={<SubscriptionTransactionsForm />}
          />

          <Route
            path="/subscription-plan-offers"
            element={<SubscriptionPlanOffers />}
          />
          <Route
            path="/subscription-plan-offers/add"
            element={<SubscriptionPlanOffersForm />}
          />
          <Route
            path="/subscription-plan-offers/edit/:id"
            element={<SubscriptionPlanOffersForm />}
          />
          <Route
            path="/subscription-plan-offers/view/:id"
            element={<SubscriptionPlanOffersForm />}
          />

          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoices/add" element={<InvoicesForm />} />
          <Route path="/invoices/edit/:id" element={<InvoicesForm />} />
          <Route path="/invoices/view/:id" element={<InvoicesForm />} />

          <Route
            path="/subscription-plans/features/:id"
            element={<SubscriptionPlansFeatures />}
          />

          <Route
            path="/subscription-plan-features"
            element={<SubscriptionPlanFeatures />}
          />
          <Route
            path="/subscription-plan-features/add"
            element={<SubscriptionPlanFeaturesForm />}
          />
          <Route
            path="/subscription-plan-features/edit/:id"
            element={<SubscriptionPlanFeaturesForm />}
          />
          <Route
            path="/subscription-plan-features/view/:id"
            element={<SubscriptionPlanFeaturesForm />}
          />

          <Route
            path="/subscription-plan-features/bulk-add"
            element={<SubscriptionPlanFeatureBulkAdd />}
          />

          <Route
            path="/subscription-plan-features/bulk-edit"
            element={<SubscriptionPlanFeatureBulkEdit />}
          />

          <Route path="/contact" element={<ContactList />} />
          <Route path="/contact/view/:id" element={<ContactView />} />
          <Route path="/contact/edit/:id" element={<ContactEdit />} />

          {/* Tanvi modules */}
          <Route path="/cities" element={<City />} />
          <Route path="/cities/add" element={<AddCity />} />
          <Route path="/cities/edit/:id" element={<EditCity />} />
          <Route path="/cities/view/:id" element={<ViewCity />} />

          <Route path="/states" element={<State />} />
          <Route path="/state" element={<Navigate to="/states" replace />} />
          <Route
            path="/state/add"
            element={<Navigate to="/states/add" replace />}
          />
          <Route
            path="/state/edit/:id"
            element={<Navigate to="/states/edit/:id" replace />}
          />
          <Route
            path="/state/view/:id"
            element={<Navigate to="/states/view/:id" replace />}
          />
          <Route path="/states/add" element={<AddState />} />
          <Route path="/states/edit/:id" element={<EditState />} />
          <Route path="/states/view/:id" element={<ViewState />} />

          <Route path="/languages" element={<Language />} />
          <Route path="/languages/add" element={<AddLanguage />} />
          <Route path="/languages/edit/:id" element={<EditLanguage />} />
          <Route path="/languages/view/:id" element={<ViewLanguage />} />

          {/* <Route path="/departments" element={<Department />} />
          <Route path="/departments/add" element={<AddDepartment />} />
          <Route path="/departments/edit/:id" element={<EditDepartment />} />
          <Route path="/departments/view/:id" element={<ViewDepartment />} /> */}

          <Route path="/currencies" element={<Currency />} />
          <Route path="/currencies/add" element={<AddCurrency />} />
          <Route path="/currencies/edit/:id" element={<EditCurrency />} />
          <Route path="/currencies/view/:id" element={<ViewCurrency />} />

          <Route path="/billing-rates" element={<BillingRate />} />

          <Route path="/billing-rates/add" element={<AddBillingRate />} />
          <Route path="/billing-rates/edit/:id" element={<EditBillingRate />} />
          <Route path="/billing-rates/view/:id" element={<ViewBillingRate />} />

          <Route path="/banners" element={<Banners />} />
          <Route path="/banners/add" element={<AddBanner />} />
          <Route path="/banners/edit/:id" element={<EditBanner />} />
          <Route path="/banners/view/:id" element={<ViewBanner />} />

          <Route path="/experience-levels" element={<ExperienceLevels />} />
          <Route
            path="/experience-levels/add"
            element={<AddExperienceLevel />}
          />
          <Route
            path="/experience-levels/edit/:id"
            element={<EditExperienceLevel />}
          />
          <Route
            path="/experience-levels/view/:id"
            element={<ViewExperienceLevel />}
          />

          <Route path="/workplace-types" element={<WorkplaceType />} />
          <Route path="/workplace-types/add" element={<AddWorkplaceType />} />
          <Route
            path="/workplace-types/edit/:id"
            element={<EditWorkplaceType />}
          />
          <Route
            path="/workplace-types/view/:id"
            element={<ViewWorkplaceType />}
          />

          <Route path="/application-statuses" element={<ApplicationStatus />} />
          <Route
            path="/application-statuses/add"
            element={<AddApplicationStatus />}
          />
          <Route
            path="/application-statuses/edit/:id"
            element={<EditApplicationStatus />}
          />
          <Route
            path="/application-statuses/view/:id"
            element={<ViewApplicationStatus />}
          />

          <Route
            path="/company-testimonials"
            element={<CompanyTestimonials />}
          />
          <Route
            path="/company-testimonials/add"
            element={<AddCompanyTestimonial />}
          />
          <Route
            path="/company-testimonials/edit/:id"
            element={<EditCompanyTestimonial />}
          />
          <Route
            path="/company-testimonials/view/:id"
            element={<ViewCompanyTestimonial />}
          />

          <Route path="/subscription-plans" element={<SubscriptionPlans />} />
          <Route
            path="/subscription-plans/add"
            element={<SubscriptionPlansForm />}
          />
          <Route
            path="/subscription-plans/edit/:id"
            element={<SubscriptionPlansForm />}
          />
          <Route
            path="/subscription-plans/view/:id"
            element={<SubscriptionPlansForm />}
          />

          <Route
            path="/subscription-plan-features"
            element={<SubscriptionPlanFeatures />}
          />

          <Route
            path="/subscription-coupons"
            element={<SubscriptionCoupons />}
          />
          <Route
            path="/subscription-coupons/add"
            element={<AddSubscriptionCoupon />}
          />
          <Route
            path="/subscription-coupons/edit/:id"
            element={<EditSubscriptionCoupon />}
          />
          <Route
            path="/subscription-coupons/view/:id"
            element={<ViewSubscriptionCoupon />}
          />

          <Route
            path="/company-subscriptions"
            element={<CompanySubscriptions />}
          />
          <Route
            path="/company-subscriptions/add"
            element={<AddCompanySubscription />}
          />
          <Route
            path="/company-subscriptions/edit/:id"
            element={<EditCompanySubscription />}
          />
          <Route
            path="/company-subscriptions/view/:id"
            element={<ViewCompanySubscription />}
          />

          {/* <Route path="/subscription-renewal-logs" element={<SubscriptionRenewalLogs />} /> */}
          <Route
            path="/subscription-renewal-logs"
            element={<SubscriptionRenewalLogs />}
          />
          <Route
            path="/subscription-renewal-logs/add"
            element={<AddSubscriptionRenewalLog />}
          />
          <Route
            path="/subscription-renewal-logs/edit/:id"
            element={<EditSubscriptionRenewalLog />}
          />
          <Route
            path="/subscription-renewal-logs/view/:id"
            element={<ViewSubscriptionRenewalLog />}
          />

          <Route path="/project-settings" element={<ProjectSettings />} />
          <Route
            path="/project-settings/add"
            element={<AddProjectSettings />}
          />
          <Route
            path="/project-settings/edit/:id"
            element={<EditProjectSettings />}
          />
          <Route
            path="/project-settings/view/:id"
            element={<ViewProjectSettings />}
          />

          <Route path="/demo-requests" element={<DemoRequest />} />
          <Route path="/demo-requests/add" element={<AddDemoRequest />} />
          <Route path="/demo-requests/edit/:id" element={<EditDemoRequest />} />
          <Route path="/demo-requests/view/:id" element={<ViewDemoRequest />} />

          <Route
            path="/candidate-testimonials"
            element={<CandidateTestimonial />}
          />
          <Route
            path="/candidate-testimonials/add"
            element={<AddCandidateTestimonial />}
          />
          <Route
            path="/candidate-testimonials/edit/:id"
            element={<EditCandidateTestimonial />}
          />
          <Route
            path="/candidate-testimonials/view/:id"
            element={<ViewCandidateTestimonial />}
          />
          <Route path="/candidate-faq" element={<CandidateFaq />} />
          <Route path="/candidate-faq/add" element={<AddCandidateFaq />} />
          <Route
            path="/candidate-faq/edit/:id"
            element={<EditCandidateFaq />}
          />
          <Route
            path="/candidate-faq/view/:id"
            element={<ViewCandidateFaq />}
          />

          <Route path="/company-faq" element={<CompanyFaq />} />
          <Route path="/company-faq/add" element={<AddCompanyFaq />} />
          <Route path="/company-faq/edit/:id" element={<EditCompanyFaq />} />
          <Route path="/company-faq/view/:id" element={<ViewCompanyFaq />} />

          <Route path="/salary" element={<Salary />} />
          <Route path="/salary/add" element={<AddSalary />} />
          <Route path="/salary/edit/:id" element={<EditSalary />} />
          <Route path="/salary/view/:id" element={<ViewSalary />} />

          {/* Sharddha modules */}
          <Route path="/notice-periods" element={<NoticePeriod />} />
          <Route path="/notice-periods/add" element={<AddNoticePeriod />} />
          <Route
            path="/notice-periods/edit/:id"
            element={<EditNoticePeriod />}
          />
          <Route
            path="/notice-periods/view/:id"
            element={<ViewNoticePeriod />}
          />

          <Route path="/company-types" element={<CompanyType />} />
          <Route path="/company-types/add" element={<AddCompanyType />} />
          <Route path="/company-types/edit/:id" element={<EditCompanyType />} />
          <Route path="/company-types/view/:id" element={<ViewCompanyType />} />

          <Route path="/company-sizes" element={<CompanySize />} />
          <Route path="/company-sizes/add" element={<AddCompanySize />} />
          <Route path="/company-sizes/edit/:id" element={<EditCompanySize />} />
          <Route path="/company-sizes/view/:id" element={<ViewCompanySize />} />

          {/* <Route path="/notifications" element={<Notification />} /> */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
