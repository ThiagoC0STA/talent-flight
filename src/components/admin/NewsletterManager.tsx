"use client";

import { useState, useEffect } from "react";
import { Mail, Download, Trash2, Calendar, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  source: string;
}

export default function NewsletterManager() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscriber = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return;

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setSubscribers(subscribers.filter(sub => sub.id !== id));
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      alert("Failed to delete subscriber");
    }
  };

  const exportEmails = () => {
    const emails = subscribers.map(sub => sub.email).join("\n");
    const blob = new Blob([emails], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredSubscribers = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: subscribers.length,
    active: subscribers.filter(sub => sub.is_active).length,
    thisMonth: subscribers.filter(sub => {
      const created = new Date(sub.created_at);
      const now = new Date();
      return created.getMonth() === now.getMonth() && 
             created.getFullYear() === now.getFullYear();
    }).length
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-xl flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#011640]">Newsletter Subscribers</h2>
            <p className="text-[#010D26] opacity-75">Manage your email list</p>
          </div>
        </div>
        <button
          onClick={exportEmails}
          className="flex items-center gap-2 bg-[#0476D9] text-white px-4 py-2 rounded-xl hover:bg-[#011640] transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Emails
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-[#0476D9]" />
            <div>
              <p className="text-sm text-[#010D26] opacity-75">Total Subscribers</p>
              <p className="text-2xl font-bold text-[#011640]">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Mail className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-[#010D26] opacity-75">Active</p>
              <p className="text-2xl font-bold text-[#011640]">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-[#010D26] opacity-75">This Month</p>
              <p className="text-2xl font-bold text-[#011640]">{stats.thisMonth}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 px-4 py-3 border border-[#E5EAF1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0476D9] focus:border-transparent"
        />
      </div>

      {/* Subscribers List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F3F7FA]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#011640]">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#011640]">Source</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#011640]">Subscribed</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#011640]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#011640]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF1]">
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-[#F3F7FA] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#0476D9] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {subscriber.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-[#011640]">{subscriber.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {subscriber.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#010D26] opacity-75">
                    {new Date(subscriber.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      subscriber.is_active 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {subscriber.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteSubscriber(subscriber.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete subscriber"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSubscribers.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm ? "No subscribers found matching your search." : "No subscribers yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 