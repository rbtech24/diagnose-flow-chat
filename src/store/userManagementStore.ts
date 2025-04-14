
  fetchUserById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          companies:company_id (name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (!data) return null;
      
      let companyName = '';
      // Ensure companies is not null before trying to access it
      if (data.companies && typeof data.companies === 'object') {
        // Use nullish coalescing to provide a fallback for the name property
        companyName = data.companies.name ?? '';
      }
      
      return {
        id: data.id,
        name: data.name || '',
        email: data.email,
        role: data.role as 'admin' | 'company' | 'tech',
        status: data.status as 'active' | 'inactive' | 'pending' | 'archived' | 'deleted',
        companyId: data.company_id,
        companyName,
        isMainAdmin: false // This would need additional logic
      };
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      toast.error('Failed to load user details');
      return null;
    }
  },
