import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Shield, AlertTriangle } from "lucide-react";
import { ComplianceNote } from "@/types/brand-management";
import { toast } from "sonner";

interface ComplianceNotesProps {
  notes: ComplianceNote[];
  onAdd: (note: Omit<ComplianceNote, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdate: (id: string, updates: Partial<ComplianceNote>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  clientId: string;
}

export const ComplianceNotesManager = ({ notes, onAdd, onUpdate, onDelete, clientId }: ComplianceNotesProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({
    industry: '',
    regulation_type: '',
    compliance_rules: '',
    prohibited_terms: '',
    required_disclaimers: '',
    approval_requirements: '',
    is_active: true
  });

  const industries = [
    'Healthcare', 'Finance', 'Legal', 'Education', 'Real Estate', 
    'Insurance', 'Pharmaceutical', 'Automotive', 'Food & Beverage',
    'Technology', 'Government', 'Non-profit', 'Other'
  ];

  const regulationTypes = [
    'HIPAA', 'GDPR', 'CCPA', 'SOX', 'FDA', 'FTC', 'SEC', 'FINRA',
    'FERPA', 'COPPA', 'CAN-SPAM', 'TCPA', 'ADA', 'FHA', 'Other'
  ];

  const handleAdd = async () => {
    if (!newNote.industry || !newNote.compliance_rules) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      const prohibitedTermsArray = newNote.prohibited_terms
        ? newNote.prohibited_terms.split(',').map(term => term.trim()).filter(term => term)
        : [];

      const requiredDisclaimersArray = newNote.required_disclaimers
        ? newNote.required_disclaimers.split('\n').map(disclaimer => disclaimer.trim()).filter(disclaimer => disclaimer)
        : [];

      await onAdd({
        client_id: clientId,
        industry: newNote.industry,
        regulation_type: newNote.regulation_type || undefined,
        compliance_rules: newNote.compliance_rules,
        prohibited_terms: prohibitedTermsArray,
        required_disclaimers: requiredDisclaimersArray,
        approval_requirements: newNote.approval_requirements || undefined,
        is_active: newNote.is_active
      });
      
      setNewNote({
        industry: '',
        regulation_type: '',
        compliance_rules: '',
        prohibited_terms: '',
        required_disclaimers: '',
        approval_requirements: '',
        is_active: true
      });
      setIsAdding(false);
      toast.success("Compliance note added successfully");
    } catch (error) {
      toast.error("Failed to add compliance note");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      toast.success("Compliance note deleted successfully");
    } catch (error) {
      toast.error("Failed to delete compliance note");
    }
  };

  const handleToggleActive = async (id: string, is_active: boolean) => {
    try {
      await onUpdate(id, { is_active });
      toast.success(`Compliance note ${is_active ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error("Failed to update compliance note");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Compliance Notes</h3>
          <p className="text-sm text-muted-foreground">
            Manage industry-specific compliance requirements and content restrictions
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Compliance Note
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Add New Compliance Note
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Select value={newNote.industry} onValueChange={(value) => setNewNote({ ...newNote, industry: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="regulation_type">Regulation Type</Label>
                <Select value={newNote.regulation_type} onValueChange={(value) => setNewNote({ ...newNote, regulation_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select regulation" />
                  </SelectTrigger>
                  <SelectContent>
                    {regulationTypes.map((regulation) => (
                      <SelectItem key={regulation} value={regulation}>{regulation}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="compliance_rules">Compliance Rules *</Label>
              <Textarea
                id="compliance_rules"
                value={newNote.compliance_rules}
                onChange={(e) => setNewNote({ ...newNote, compliance_rules: e.target.value })}
                placeholder="Describe the key compliance requirements and rules that must be followed..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prohibited_terms">Prohibited Terms (comma-separated)</Label>
              <Textarea
                id="prohibited_terms"
                value={newNote.prohibited_terms}
                onChange={(e) => setNewNote({ ...newNote, prohibited_terms: e.target.value })}
                placeholder="guarantee, cure, miracle, instant..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="required_disclaimers">Required Disclaimers (one per line)</Label>
              <Textarea
                id="required_disclaimers"
                value={newNote.required_disclaimers}
                onChange={(e) => setNewNote({ ...newNote, required_disclaimers: e.target.value })}
                placeholder="Results not typical. Individual results may vary.
This is not medical advice. Consult your physician.
Terms and conditions apply."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="approval_requirements">Approval Requirements</Label>
              <Textarea
                id="approval_requirements"
                value={newNote.approval_requirements}
                onChange={(e) => setNewNote({ ...newNote, approval_requirements: e.target.value })}
                placeholder="Describe who needs to approve content and the review process..."
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={newNote.is_active}
                onCheckedChange={(checked) => setNewNote({ ...newNote, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd}>Add Compliance Note</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {notes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Compliance Notes Defined</h3>
              <p className="text-muted-foreground text-center mb-4">
                Add compliance requirements to ensure content meets industry regulations
              </p>
              <Button onClick={() => setIsAdding(true)}>Add First Compliance Note</Button>
            </CardContent>
          </Card>
        ) : (
          notes.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      {note.industry}
                      {note.regulation_type && (
                        <Badge variant={note.is_active ? "default" : "secondary"}>
                          {note.regulation_type}
                        </Badge>
                      )}
                      {!note.is_active && (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Industry compliance requirements and restrictions
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={note.is_active}
                      onCheckedChange={(checked) => handleToggleActive(note.id, checked)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(note.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Compliance Rules</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                      {note.compliance_rules}
                    </p>
                  </div>

                  {note.prohibited_terms && note.prohibited_terms.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        Prohibited Terms
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {note.prohibited_terms.map((term, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {term}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {note.required_disclaimers && note.required_disclaimers.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Required Disclaimers</h4>
                      <div className="space-y-1">
                        {note.required_disclaimers.map((disclaimer, index) => (
                          <div key={index} className="text-xs bg-muted p-2 rounded border-l-2 border-primary">
                            {disclaimer}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {note.approval_requirements && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Approval Requirements</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                        {note.approval_requirements}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};