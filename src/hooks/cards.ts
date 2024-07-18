import { QueryFunctionContext, Mutation, useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getFromApi, postToApi, deleteFromApi } from "../utils/fetching";
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


function getCardList({ queryKey }: QueryFunctionContext<[string]>): Promise<Card[]> {
  return getFromApi("/allMyCards");
};

function submitCard(request: CardCreationRequest): Promise<ApiResponse> {
  return postToApi("/addCard", {
    credentials: "include",
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify(request)
  });
};

function deleteCard(cardId: string): Promise<ApiResponse> {
  return deleteFromApi(`/cards/${cardId}`);
}
function submitEditedCard({cardId, request}: {cardId: string, request: CardEditionRequest}): Promise<ApiResponse> {
  return postToApi(`/editCard/${cardId}`, {
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



export function useCardList() {
  const { sessionExpired } = useAuthentication();
  const query = useQuery({ 
    queryKey: ['getCards'], 
    queryFn: getCardList,
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

export function useCardCreationForm() {
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const { sessionExpired } = useAuthentication();
  const mutation = useMutation({
    mutationFn: submitCard,
    onSuccess() {
      // Invalidate cards lists
      queryClient.invalidateQueries({ queryKey: ['getCards'] })

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
        "Card created successfully",
        [{
          text: "OK", 
          onPress: async () => {
            await delay(100);
            navigation.navigate("card-list" as never);
            navigation.navigate("Table" as never);
          }
        }]
      );
    }
  }, [mutation.isSuccess]);

  return mutation;
}
export function useDeleteCard() {
  const queryClient = useQueryClient();
  const { sessionExpired } = useAuthentication();

  const mutation = useMutation({
    mutationFn: deleteCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllMyCards'] });
    },
    onError: (error) => {
      if (error instanceof SessionExpiredError) {
        Alert.alert(
          "Session Expired",
          error.message,
          [{ text: "Return to Login", onPress: sessionExpired }]
        );
      } else {
        console.error("Error deleting card:", error);
        Alert.alert(
          "Error al eliminar",
          error.message || "An error occurred while deleting the card."
        );
      }
    },
    retry: false
  });

  return mutation;
}
export function useEditCardForm() {
  const queryClient = useQueryClient();
  const { sessionExpired } = useAuthentication();
  const mutation = useMutation({
    mutationFn: submitEditedCard,
    onSuccess: () => {
      // Invalidate the cards list and other related queries
      queryClient.invalidateQueries({ queryKey: ['getAllMyCards'] });    },
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
