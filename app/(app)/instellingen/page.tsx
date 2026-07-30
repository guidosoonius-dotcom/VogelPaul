import { getOwnProfile } from "@/lib/queries/profile";
import { FieldWrapper, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { updateProfile } from "./actions";

export default async function InstellingenPage() {
  const profile = await getOwnProfile();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Instellingen</h1>
      <div className="mt-6 max-w-md rounded-md border border-zinc-200 bg-white p-6">
        <form action={updateProfile} className="space-y-4">
          <FieldWrapper label="Naam" htmlFor="display_name">
            <Input
              id="display_name"
              name="display_name"
              defaultValue={profile?.display_name ?? ""}
            />
          </FieldWrapper>
          <FieldWrapper
            label="Standaard verenigingscode"
            htmlFor="federation_code"
            hint="Bv. je NBvV-lidnummer. Wordt gebruikt als standaardwaarde bij het toevoegen van een nieuwe vogel."
          >
            <Input
              id="federation_code"
              name="federation_code"
              defaultValue={profile?.federation_code ?? ""}
            />
          </FieldWrapper>
          <Button type="submit">Opslaan</Button>
        </form>
      </div>
    </div>
  );
}
