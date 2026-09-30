import { supabase } from "../config/supabaseClient.js";

export const LoanModel = {
  async getAll(filters = {}) {
    let query = supabase.from("loans").select(`
      id, loan_date, due_date, return_date, status,
      members ( id, name ),
      books ( id, title )
    `);

    if (filters.status) query = query.eq("status", filters.status);
    if (filters.member_id) query = query.eq("member_id", filters.member_id);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("loans")
      .select(
        `
        id, loan_date, due_date, return_date, status,
        members ( id, name, email, phone ),
        books ( id, isbn, title, author )
        `
      )
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase
      .from("loans")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from("loans")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from("loans").delete().eq("id", id);
    if (error) throw error;
    return { message: "Loan deleted successfully" };
  },
};
