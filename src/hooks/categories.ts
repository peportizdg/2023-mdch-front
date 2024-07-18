import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { getFromApi } from "../utils/fetching";
import { Alert } from "react-native";
import SessionExpiredError from "../errors/SessionExpiredError";
import { useAuthentication } from "./authentication";
import { useEffect } from "react";







// ***********************************
//
//  Fetch Queries
//
// ***********************************

function getUserCategories({ queryKey }: QueryFunctionContext<[string]>): Promise<Category[]> {
  return getFromApi("/getAllCategories");
}

function getUserCategoriesWithIcons({ queryKey }: QueryFunctionContext<[string]>): Promise<CategoryWithIcon[]> {
  return getFromApi("/getAllCategoriesWithIcons");
}







// ***********************************
//
//  Custom Hooks
//
// ***********************************

export function useUserCategories() {
  const { sessionExpired } = useAuthentication();
  const query = useQuery({
    queryKey: ["getAllCategories"],
    queryFn: getUserCategories,
    placeholderData: [],
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
        "Error porque no existe el endpoint",
        query.error.message
      );
    }
  }, [query.error]);

  return query;
}

export function useUserCategoriesWithIcons() {
  const { sessionExpired } = useAuthentication();
  const query = useQuery({
    queryKey: ["getAllCategoriesWithIcons"],
    queryFn: getUserCategoriesWithIcons,
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
        "Error porque no existe el endpoint",
        query.error.message
      );
    }
  }, [query.error]);

  return query;
}
