import { supabase } from "@/lib/supabase";

export const updateUserData = async (userId: string, data : any) => {
    try {
        
        const {error} = await supabase
        .from('users')
        .update(data)
        .eq('id',userId)
        
        if(error){
            return {success : false, msg: error?.message}
        }

        return {success: true, data};

    } catch (error) {
        console.log(error);
        return {success : false, msg : error.message};
    }
}

export const getUserData = async (userId: string) => {
    try {
        
        const {data, error} = await supabase
        .from('users')
        .select()
        .eq('id',userId)
        .single()
        
        if(error){
            return {success : false, msg: error?.message}
        }

        return {success: true, data};

    } catch (error) {
        console.log(error);
        return {success : false, msg : error.message};
    }
}