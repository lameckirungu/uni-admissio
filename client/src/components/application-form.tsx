import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  applicationFormSchema,
  personalInfoSchema,
  contactInfoSchema,
  familyInfoSchema,
  residenceInfoSchema,
  educationInfoSchema,
  medicalInfoSchema,
  acceptanceSchema,
  ApplicationForm as ApplicationFormType
} from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Application } from "@shared/schema";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

interface ApplicationFormProps {
  application?: Application | null;
  isLoading: boolean;
}

export function ApplicationForm({ application, isLoading }: ApplicationFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  
  // If the user is not a student, don't allow form access
  const isStudent = user?.role === "student";
  
  // Create form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof applicationFormSchema>>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      personalInfo: {
        firstName: "",
        middleName: "",
        lastName: "",
        nationalIdOrBirthCertNo: "",
        hudumaNo: "",
        nhifNo: "",
        dateOfBirth: "",
        gender: "male",
        religion: "",
        nationality: "",
        maritalStatus: "single",
        physicalImpairment: false,
        impairmentDetails: ""
      },
      contactInfo: {
        postalAddress: "",
        postalCode: "",
        town: "",
        mobilePhone: "",
        email: "",
        county: ""
      },
      familyInfo: {
        fatherName: "",
        fatherOccupation: "",
        fatherAlive: true,
        motherName: "",
        motherOccupation: "",
        motherAlive: true,
        numberOfSiblings: 0,
        spouseName: "",
        spouseOccupation: "",
        spousePhone: ""
      },
      residenceInfo: {
        placeOfBirth: "",
        permanentResidence: "",
        nearestTown: "",
        location: "",
        subCounty: "",
        constituency: "",
        nearestPoliceStation: ""
      },
      educationInfo: {
        kcseSchool: "",
        kcseIndex: "",
        kcseYear: "",
        kcseResults: "",
        kcpeSchool: "",
        kcpeIndex: "",
        kcpeYear: "",
        kcpeResults: "",
        otherQualifications: ""
      },
      medicalInfo: {
        everAdmitted: false,
        admissionDetails: "",
        tbHistory: false,
        tbDetails: "",
        fitHistory: false,
        fitDetails: "",
        heartDiseaseHistory: false,
        heartDiseaseDetails: "",
        digestiveDiseaseHistory: false,
        digestiveDiseaseDetails: "",
        allergiesHistory: false,
        allergiesDetails: ""
      },
      documents: {
        nationalId: false,
        kcseResults: false,
        kcpeResults: false,
        passportPhoto: false
      },
      acceptance: {
        acceptOffer: false,
        imageReleaseConsent: false
      }
    }
  });

  // Prefill form with existing application data if available
  useEffect(() => {
    if (application?.formData) {
      form.reset(application.formData as any);
    }
  }, [application, form]);

  // Mutations for saving/submitting the application
  const saveDraftMutation = useMutation({
    mutationFn: async (formData: ApplicationFormType) => {
      const res = await apiRequest("POST", "/api/applications", { formData });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications/user"] });
      toast({
        title: "Draft saved",
        description: "Your application has been saved as a draft.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Save failed",
        description: error.message || "Failed to save your application. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle saving draft
  const onSaveDraft = async () => {
    try {
      const values = form.getValues();
      await saveDraftMutation.mutateAsync(values);
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof applicationFormSchema>) => {
    try {
      await saveDraftMutation.mutateAsync(data);
      // Could navigate or update status here
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Handle tab changes
  const changeTab = (tab: string) => {
    setActiveTab(tab);
    // Save draft when changing tabs
    onSaveDraft();
  };

  if (isLoading) {
    return (
      <Card className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 w-1/4 bg-slate-200 rounded mb-4"></div>
            <div className="h-4 w-1/3 bg-slate-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-10 bg-slate-200 rounded"></div>
              <div className="h-10 bg-slate-200 rounded"></div>
              <div className="h-10 bg-slate-200 rounded"></div>
              <div className="h-10 bg-slate-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error message if the user is not a student
  if (!isStudent) {
    return (
      <Card className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Access Denied</h2>
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center p-6 gap-4 text-center">
            <div className="bg-red-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-600">Administrator Access Restricted</h3>
            <p className="text-slate-600 max-w-md">
              This form is only accessible to student users. As an administrator, 
              you do not have permission to fill or submit student application forms.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Application Form</h2>
        <p className="text-sm text-slate-600">Please complete all sections accurately</p>
      </div>
      
      <CardContent className="p-6">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Form Navigation */}
            <div className="mb-6 flex overflow-x-auto gap-2">
              <Button 
                type="button"
                variant={activeTab === "personal" ? "secondary" : "ghost"}
                onClick={() => changeTab("personal")}
                className="shrink-0"
              >
                Personal Information
              </Button>
              <Button 
                type="button"
                variant={activeTab === "contact" ? "secondary" : "ghost"}
                onClick={() => changeTab("contact")}
                className="shrink-0"
              >
                Contact Details
              </Button>
              <Button 
                type="button"
                variant={activeTab === "family" ? "secondary" : "ghost"}
                onClick={() => changeTab("family")}
                className="shrink-0"
              >
                Family Information
              </Button>
              <Button 
                type="button"
                variant={activeTab === "residence" ? "secondary" : "ghost"}
                onClick={() => changeTab("residence")}
                className="shrink-0"
              >
                Residence
              </Button>
              <Button 
                type="button"
                variant={activeTab === "education" ? "secondary" : "ghost"}
                onClick={() => changeTab("education")}
                className="shrink-0"
              >
                Education
              </Button>
              <Button 
                type="button"
                variant={activeTab === "medical" ? "secondary" : "ghost"}
                onClick={() => changeTab("medical")}
                className="shrink-0"
              >
                Medical History
              </Button>
              <Button 
                type="button"
                variant={activeTab === "acceptance" ? "secondary" : "ghost"}
                onClick={() => changeTab("acceptance")}
                className="shrink-0"
              >
                Acceptance
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              {/* Personal Information Section */}
              <TabsContent value="personal" className="space-y-4">
                <h3 className="text-base font-semibold leading-7 text-slate-900">Personal Information</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">Provide your personal details as they appear on your official documents.</p>
                
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <FormField
                      control={form.control}
                      name="personalInfo.firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <FormField
                      control={form.control}
                      name="personalInfo.middleName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Middle name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <FormField
                      control={form.control}
                      name="personalInfo.lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="personalInfo.nationalIdOrBirthCertNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>National ID/Birth Certificate No.</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="personalInfo.hudumaNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Huduma No.</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="personalInfo.nhifNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NHIF No.</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="personalInfo.dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="personalInfo.gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="personalInfo.religion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Religion</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="christian">Christian</SelectItem>
                              <SelectItem value="muslim">Muslim</SelectItem>
                              <SelectItem value="hindu">Hindu</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="personalInfo.nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="kenyan">Kenyan</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="personalInfo.maritalStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marital Status</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="single">Single</SelectItem>
                              <SelectItem value="married">Married</SelectItem>
                              <SelectItem value="divorced">Divorced</SelectItem>
                              <SelectItem value="widowed">Widowed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <FormField
                      control={form.control}
                      name="personalInfo.physicalImpairment"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Physical Impairment</FormLabel>
                            <FormDescription>
                              Do you have any physical impairment?
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {form.watch("personalInfo.physicalImpairment") && (
                    <div className="sm:col-span-6">
                      <FormField
                        control={form.control}
                        name="personalInfo.impairmentDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Impairment Details</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please provide details about your impairment"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onSaveDraft}
                    disabled={saveDraftMutation.isPending}
                  >
                    Save Draft
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => changeTab("contact")}
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>

              {/* Contact Details Section */}
              <TabsContent value="contact" className="space-y-4">
                <h3 className="text-base font-semibold leading-7 text-slate-900">Contact Details</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">Provide your current contact information.</p>
                
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <FormField
                      control={form.control}
                      name="contactInfo.postalAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Address</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="P.O. Box" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <FormField
                      control={form.control}
                      name="contactInfo.postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <FormField
                      control={form.control}
                      name="contactInfo.town"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Town</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="contactInfo.mobilePhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="contactInfo.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="contactInfo.county"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>County</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => changeTab("personal")}
                  >
                    Previous
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onSaveDraft}
                    disabled={saveDraftMutation.isPending}
                  >
                    Save Draft
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => changeTab("family")}
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>

              {/* Family Information Section */}
              <TabsContent value="family" className="space-y-4">
                <h3 className="text-base font-semibold leading-7 text-slate-900">Family Information</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">Provide details about your family.</p>
                
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="familyInfo.fatherName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Father's Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="familyInfo.fatherOccupation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Father's Occupation</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="familyInfo.fatherAlive"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Father's Status</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) => field.onChange(value === 'true')}
                              defaultValue={field.value ? 'true' : 'false'}
                              className="flex flex-row space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="true" id="father-alive" />
                                <Label htmlFor="father-alive">Alive</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="false" id="father-deceased" />
                                <Label htmlFor="father-deceased">Deceased</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="familyInfo.motherName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mother's Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="familyInfo.motherOccupation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mother's Occupation</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="familyInfo.motherAlive"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mother's Status</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) => field.onChange(value === 'true')}
                              defaultValue={field.value ? 'true' : 'false'}
                              className="flex flex-row space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="true" id="mother-alive" />
                                <Label htmlFor="mother-alive">Alive</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="false" id="mother-deceased" />
                                <Label htmlFor="mother-deceased">Deceased</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="familyInfo.numberOfSiblings"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Siblings</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {form.watch("personalInfo.maritalStatus") === "married" && (
                    <>
                      <div className="sm:col-span-3">
                        <FormField
                          control={form.control}
                          name="familyInfo.spouseName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Spouse's Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <FormField
                          control={form.control}
                          name="familyInfo.spouseOccupation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Spouse's Occupation</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <FormField
                          control={form.control}
                          name="familyInfo.spousePhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Spouse's Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => changeTab("contact")}
                  >
                    Previous
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onSaveDraft}
                    disabled={saveDraftMutation.isPending}
                  >
                    Save Draft
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => changeTab("residence")}
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>

              {/* Residence Section */}
              <TabsContent value="residence" className="space-y-4">
                <h3 className="text-base font-semibold leading-7 text-slate-900">Residence Information</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">Provide details about your permanent residence.</p>
                
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="residenceInfo.placeOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Place of Birth</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="residenceInfo.permanentResidence"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Permanent Residence</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Village/Town" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="residenceInfo.nearestTown"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nearest Town</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="residenceInfo.location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="residenceInfo.subCounty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sub-County</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="residenceInfo.constituency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Constituency</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="residenceInfo.nearestPoliceStation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nearest Police Station</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => changeTab("family")}
                  >
                    Previous
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onSaveDraft}
                    disabled={saveDraftMutation.isPending}
                  >
                    Save Draft
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => changeTab("education")}
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>

              {/* Education Section */}
              <TabsContent value="education" className="space-y-4">
                <h3 className="text-base font-semibold leading-7 text-slate-900">Education Information</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">Provide details about your educational background.</p>
                
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">KCSE Information</h4>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="educationInfo.kcseSchool"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="educationInfo.kcseIndex"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Index Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="educationInfo.kcseYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <FormField
                      control={form.control}
                      name="educationInfo.kcseResults"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>KCSE Results</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter your KCSE results (subjects and grades)"
                              className="resize-none"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <h4 className="text-sm font-medium text-slate-700 mb-2 mt-4">KCPE Information</h4>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="educationInfo.kcpeSchool"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="educationInfo.kcpeIndex"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Index Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="educationInfo.kcpeYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <FormField
                      control={form.control}
                      name="educationInfo.kcpeResults"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>KCPE Results</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter your KCPE results (subjects and marks)"
                              className="resize-none"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <FormField
                      control={form.control}
                      name="educationInfo.otherQualifications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Other Qualifications/Institutions</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="List any other qualifications or institutions attended"
                              className="resize-none"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => changeTab("residence")}
                  >
                    Previous
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onSaveDraft}
                    disabled={saveDraftMutation.isPending}
                  >
                    Save Draft
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => changeTab("medical")}
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>

              {/* Medical History Section */}
              <TabsContent value="medical" className="space-y-4">
                <h3 className="text-base font-semibold leading-7 text-slate-900">Medical History</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">Provide details about your medical history.</p>
                
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="medicalInfo.everAdmitted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Have you ever been admitted to a hospital?</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {form.watch("medicalInfo.everAdmitted") && (
                    <div className="sm:col-span-6">
                      <FormField
                        control={form.control}
                        name="medicalInfo.admissionDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Admission Details</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Provide reason and date of admission"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <div className="sm:col-span-6">
                    <h4 className="text-sm font-medium text-slate-700 mb-2 mt-4">Medical Conditions</h4>
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="medicalInfo.tbHistory"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>History of Tuberculosis (TB)</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {form.watch("medicalInfo.tbHistory") && (
                    <div className="sm:col-span-6">
                      <FormField
                        control={form.control}
                        name="medicalInfo.tbDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>TB Details</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Provide details" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="medicalInfo.fitHistory"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>History of Fits</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {form.watch("medicalInfo.fitHistory") && (
                    <div className="sm:col-span-6">
                      <FormField
                        control={form.control}
                        name="medicalInfo.fitDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fits Details</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Provide details" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="medicalInfo.heartDiseaseHistory"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>History of Heart Disease</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {form.watch("medicalInfo.heartDiseaseHistory") && (
                    <div className="sm:col-span-6">
                      <FormField
                        control={form.control}
                        name="medicalInfo.heartDiseaseDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Heart Disease Details</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Provide details" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="medicalInfo.digestiveDiseaseHistory"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>History of Digestive Disease</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {form.watch("medicalInfo.digestiveDiseaseHistory") && (
                    <div className="sm:col-span-6">
                      <FormField
                        control={form.control}
                        name="medicalInfo.digestiveDiseaseDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Digestive Disease Details</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Provide details" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="medicalInfo.allergiesHistory"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>History of Allergies</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {form.watch("medicalInfo.allergiesHistory") && (
                    <div className="sm:col-span-6">
                      <FormField
                        control={form.control}
                        name="medicalInfo.allergiesDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Allergies Details</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Provide details" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => changeTab("education")}
                  >
                    Previous
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onSaveDraft}
                    disabled={saveDraftMutation.isPending}
                  >
                    Save Draft
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => changeTab("acceptance")}
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>

              {/* Acceptance Section */}
              <TabsContent value="acceptance" className="space-y-4">
                <h3 className="text-base font-semibold leading-7 text-slate-900">Acceptance and Consent</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">Please read and accept the terms of admission.</p>
                
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <div className="rounded-md bg-slate-50 p-4 text-sm text-slate-700 mb-4">
                      <p className="mb-2"><strong>LETTER OF ACCEPTANCE BY THE CANDIDATE</strong></p>
                      <p>With reference to your admission letter offering me a place in the School of Computer Science, I hereby confirm that I DO ACCEPT the offer and I PROMISE TO ABIDE by the rules and regulations governing the conduct and discipline of the students of Karatina University.</p>
                      <p className="mt-2">I hereby undertake to complete the course/programme for which I have been accepted at Karatina University unless I am requested to discontinue by the University authorities.</p>
                      <p className="mt-2">I understand the change of School or Department will be permitted only by the authority of the Senate.</p>
                      <p className="mt-2">I shall accept the regulations made from time to time for the good order and governance of the University.</p>
                    </div>

                    <FormField
                      control={form.control}
                      name="acceptance.acceptOffer"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>I accept the offer and agree to abide by the rules and regulations of Karatina University</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-6 mt-4">
                    <div className="rounded-md bg-slate-50 p-4 text-sm text-slate-700 mb-4">
                      <p className="mb-2"><strong>IMAGE RELEASE CONSENT FORM</strong></p>
                      <p>I understand that my photograph and academic work may appear on the Karatina University website, University-related publications and printed or electronic media associated with the University throughout my studies and thereafter. Any such publication is not for profit and neither myself nor my family will be compensated for any such use.</p>
                      <p className="mt-2">I further understand that no address details, email addresses, or telephone numbers will appear with any internally published photograph or published work. However, my first name may be used where my identification in a photograph is necessary.</p>
                      <p className="mt-2">I agree that my photographs and any images published as described will constitute the sole property of Karatina University. I hereby release Karatina University from any and all claims whatsoever in connection with the use, reproduction, publication of the images aforesaid.</p>
                    </div>

                    <FormField
                      control={form.control}
                      name="acceptance.imageReleaseConsent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>I consent to the publication of images and name as described in the Image Release Consent Form</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => changeTab("medical")}
                  >
                    Previous
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onSaveDraft}
                    disabled={saveDraftMutation.isPending}
                  >
                    Save Draft
                  </Button>
                  <Button 
                    type="submit"
                  >
                    Save & Review Application
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
