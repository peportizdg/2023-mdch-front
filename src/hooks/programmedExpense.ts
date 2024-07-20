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

  
function getProgrammedExpenseList({ queryKey }: QueryFunctionContext<[string]>): Promise<ProgrammedExpense[]> {
  return getFromApi("/getMyProgrammedExpenses");
}

function submitProgrammedExpense(request: ProgrammedExpenseCreationRequest): Promise<ApiResponse> {
  console.log(request);
  return postToApi("/addProgrammedExpense", {
    credentials: "include",
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify(request)
  });
}

function deleteProgrammedExpense(programmedExpenseId: string): Promise<ApiResponse> {
  return deleteFromApi(`/deleteProgrammedExpense/${programmedExpenseId}`);
}

function submitEditedProgrammedExpense({programmedExpenseId, request}: {programmedExpenseId: string, request: ProgrammedExpenseEditionRequest}): Promise<ApiResponse> {
  return postToApi(`/editProgrammedExpense/${programmedExpenseId}`, {
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  });
};


// ***********************************
//
//  Custom Hooks
//
// ***********************************


export function useProgrammedExpenseList() {
  const { sessionExpired } = useAuthentication();
  const query = useQuery({ 
    queryKey: ['getProgrammedExpenses'], 
    queryFn: getProgrammedExpenseList,
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

export function useProgrammedExpenseCreationForm() {
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const { sessionExpired } = useAuthentication();
  const mutation = useMutation({
    mutationFn: submitProgrammedExpense,
    onSuccess() {
      // Invalidate programmedExpense lists
      queryClient.invalidateQueries({ queryKey: ['getProgrammedExpenses'] })
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
        "Programmed Expense created successfully",
        [{
          text: "OK", 
          onPress: async () => {
            await delay(100);
            navigation.navigate("programmedExpense-list" as never);
            navigation.navigate("Table" as never);
          }
        }]
      );
    }
  }, [mutation.isSuccess]);

  return mutation;
}

export function useDeleteProgrammedExpense() {
  const queryClient = useQueryClient();
  const { sessionExpired } = useAuthentication();

  const mutation = useMutation({
    mutationFn: deleteProgrammedExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getProgrammedExpenses'] });
      queryClient.invalidateQueries({ queryKey: ['getActiveProgrammedExpenses'] });
    },
    onError: (error) => {
      if (error instanceof SessionExpiredError) {
        Alert.alert(
          "Session Expired",
          error.message,
          [{ text: "Return to Login", onPress: sessionExpired }]
        );
      } else {
        console.error("Error deleting programmedExpense:", error);
        Alert.alert(
          "Error al eliminar",
          error.message || "An error occurred while deleting the programmedExpense."
        );
      }
    },
    retry: false
  });

  return mutation;
}


export function useEditProgrammedExpenseForm() {
  const queryClient = useQueryClient();
  const { sessionExpired } = useAuthentication();
  const mutation = useMutation({
    mutationFn: submitEditedProgrammedExpense,
    onSuccess: () => {
      // Invalidate the programmedExpenses list and other related queries
      queryClient.invalidateQueries({ queryKey: ['getProgrammedExpenses'] });
      queryClient.invalidateQueries({ queryKey: ['getActiveProgrammedExpenses'] });
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

