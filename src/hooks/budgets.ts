import { QueryFunctionContext, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFromApi, postToApi, deleteFromApi } from "../utils/fetching"; // Assuming deleteFromApi is defined in fetching utils
import { Alert } from "react-native";
import SessionExpiredError from "../errors/SessionExpiredError";
import { useAuthentication } from "./authentication";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

// ***********************************
//
//  Fetch Queries
//
// ***********************************

function getBudget({ queryKey }: QueryFunctionContext<[string, string]>): Promise<Budget> {
  const [, budgetId] = queryKey;
  return getFromApi(`/budget/${budgetId}`);
}
  
function getBudgetList({ queryKey }: QueryFunctionContext<[string]>): Promise<Budget[]> {
  return getFromApi("/allBudgets");
}

function submitBudget(request: BudgetCreationRequest): Promise<ApiResponse> {
  return postToApi("/addBudget", {
    credentials: "include",
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify(request)
  });
}

function deleteBudget(budgetId: string): Promise<ApiResponse> {
  return deleteFromApi(`/deleteBudget/${budgetId}`);
}

function submitEditedBudget({budgetId, request}: {budgetId: string, request: BudgetEditionRequest}): Promise<ApiResponse> {
  return postToApi(`/editBudget/${budgetId}`, {
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  });
};

function getActiveBudgetByDateAndCategory({ queryKey }: QueryFunctionContext<[string, string, string]>): Promise<Budget | null> {
  const [, date, category] = queryKey;
  return postToApi("/getActiveBudgets", {
    credentials: "include",
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify({ date, category })
  });
}

// ***********************************
//
//  Custom Hooks
//
// ***********************************

export function useBudget(budgetId: string) {
  const { sessionExpired } = useAuthentication();
  const query = useQuery({ 
    queryKey: ['getBudget', budgetId], 
    queryFn: getBudget,
    retry: false
  });

  useEffect(() => {
    if(query.error instanceof SessionExpiredError){
      Alert.alert(
        "Session Expired", 
        query.error.message, 
        [{text: "Return to Login", onPress: sessionExpired}]
      );

    } else if(query.isError) {
      Alert.alert(
        "Error",
        query.error.message
      );
    }
  }, [query.error]);

  return query;
}

export function useBudgetList() {
  const { sessionExpired } = useAuthentication();
  const query = useQuery({ 
    queryKey: ['getBudgets'], 
    queryFn: getBudgetList,
    retry: false
  });

  useEffect(() => {
    if(query.error instanceof SessionExpiredError){
      Alert.alert(
        "Session Expired", 
        query.error.message, 
        [{text: "Return to Login", onPress: sessionExpired}]
      );
  
    } else if(query.isError) {
      Alert.alert(
        "Error",
        query.error.message
      );
    }
  }, [query.error]);

  return query;
}

export function useBudgetCreationForm() {
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const { sessionExpired } = useAuthentication();
  const mutation = useMutation({
    mutationFn: submitBudget,
    onSuccess() {
      // Invalidate budget lists
      queryClient.invalidateQueries({ queryKey: ['getBudgets'] })
      queryClient.invalidateQueries({ queryKey: ['getActiveBudgets'] })
      // Invalidate category lists
      queryClient.invalidateQueries({ queryKey: ['getAllCategories'] })
      queryClient.invalidateQueries({ queryKey: ['getAllCategoriesWithIcons'] })
    },
    retry: false
  });
  
  useEffect(() => {
    if(mutation.error instanceof SessionExpiredError){
      Alert.alert(
        "Session Expired", 
        mutation.error.message, 
        [{text: "Return to Login", onPress: sessionExpired}]
      );
  
    } else if(mutation.isError) {
      Alert.alert(
        "Error",
        mutation.error.message
      );
    }
  }, [mutation.error]);

  useEffect(() => {
    if(mutation.isSuccess){
      Alert.alert(
        "Creation Success",
        "Budget created successfully",
        [{
          text: "OK", 
          onPress: async () => {
            await delay(100);
            navigation.navigate("budget-list" as never);
            navigation.navigate("Table" as never);
          }
        }]
      );
    }
  }, [mutation.isSuccess]);

  return mutation;
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  const { sessionExpired } = useAuthentication();

  const mutation = useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getBudgets'] });
      queryClient.invalidateQueries({ queryKey: ['getActiveBudgets'] });
    },
    onError: (error) => {
      if (error instanceof SessionExpiredError) {
        Alert.alert(
          "Session Expired",
          error.message,
          [{ text: "Return to Login", onPress: sessionExpired }]
        );
      } else {
        console.error("Error deleting budget:", error);
        Alert.alert(
          "Error al eliminar",
          error.message || "An error occurred while deleting the budget."
        );
      }
    },
    retry: false
  });

  return mutation;
}


export function useEditBudgetForm() {
  const queryClient = useQueryClient();
  const { sessionExpired } = useAuthentication();
  const mutation = useMutation({
    mutationFn: submitEditedBudget,
    onSuccess: () => {
      // Invalidate the budgets list and other related queries
      queryClient.invalidateQueries({ queryKey: ['getBudgets'] });
      queryClient.invalidateQueries({ queryKey: ['getActiveBudgets'] });
    },
    retry: false
  });

  useEffect(() => {
    if (mutation.error instanceof SessionExpiredError) {
      Alert.alert(
        "Session Expired",
        mutation.error.message,
        [{ text: "Return to Login", onPress: sessionExpired }]
      );
    } else if (mutation.isError) {
      Alert.alert(
        "Error",
        mutation.error.message
      );
    }
  }, [mutation.error]);

  return mutation;
}

export function useActiveBudgetByDateAndCategory(date: string, category: string) {
  const { sessionExpired } = useAuthentication();
  const query = useQuery({ 
    queryKey: ['getActiveBudgets', date, category], 
    queryFn: getActiveBudgetByDateAndCategory,
    retry: false
  });

  useEffect(() => {
    console.log(query.error);

    if(query.error instanceof SessionExpiredError){
      Alert.alert(
        "Session Expired", 
        query.error.message, 
        [{text: "Return to Login", onPress: sessionExpired}]
      );
  
    } else if(query.isError) {
      Alert.alert(
        "Error",
        query.error.message
      );
    }
  }, [query.error]);

  return query;
}
