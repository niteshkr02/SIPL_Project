import json
import pandas as pd


def build_manpower_json(
    excel_path="Manpower _ ROI as on 10-08-2026.xlsx",
    output_json="manpower_directory.json",
):
    # Read Master sheet
    df_master = pd.read_excel(excel_path, sheet_name="master")

    # 1. Eliminate 'HO- ROI'
    df_filtered = df_master[
        df_master["Zone / State"].astype(str).str.strip() != "HO- ROI"
    ].copy()

    states_list = []
    unique_zones = df_filtered["Zone / State"].unique()

    for zone in unique_zones:
        z_df = df_filtered[df_filtered["Zone / State"] == zone]
        personnel_list = []
        head_candidate = None

        for _, row in z_df.iterrows():
            desig = (
                str(row.get("DESIGNATION", "")).strip()
                if pd.notna(row.get("DESIGNATION"))
                else ""
            )
            emp_name = (
                str(row.get("EMP NAME", "")).strip()
                if pd.notna(row.get("EMP NAME"))
                else ""
            )
            cluster = (
                str(row.get("Cluster", "")).strip()
                if pd.notna(row.get("Cluster"))
                else ""
            )
            districts = (
                str(row.get("Districts", "")).strip()
                if pd.notna(row.get("Districts"))
                else ""
            )
            ph_off = (
                str(row.get("PH NUMBER (OFF)", "")).strip()
                if pd.notna(row.get("PH NUMBER (OFF)"))
                else ""
            )
            ph_pers = (
                str(row.get("PH NO. (PERSONAL)", "")).strip()
                if pd.notna(row.get("PH NO. (PERSONAL)"))
                else ""
            )
            email = (
                str(row.get("Email Address", "")).strip()
                if pd.notna(row.get("Email Address"))
                else ""
            )
            grp_email = (
                str(row.get("Group State Email Address", "")).strip()
                if pd.notna(row.get("Group State Email Address"))
                else ""
            )

            # Clean float text trailing .0
            if ph_off.endswith(".0"):
                ph_off = ph_off[:-2]
            if ph_pers.endswith(".0"):
                ph_pers = ph_pers[:-2]

            # Normalize placeholder dashes to empty strings so the site can
            # tell "no data" apart from a real value without re-parsing "-".
            if email == "-":
                email = ""
            if grp_email == "-":
                grp_email = ""

            person = {
                "slNo": (
                    int(row.get("SL. No"))
                    if pd.notna(row.get("SL. No"))
                    else None
                ),
                "empName": emp_name,
                "designation": desig,
                "cluster": cluster,
                "districts": districts,
                "phoneOfficial": ph_off,
                "phonePersonal": ph_pers,
                "primaryEmail": email,
                "groupEmail": grp_email,
            }

            # Select high-level designation for State Head: first person in
            # sheet order whose designation matches one of these keywords.
            if head_candidate is None:
                if any(
                    k in desig.upper()
                    for k in ["GM", "DGM", "SH", "AGM", "SENIOR MANAGER"]
                ):
                    head_candidate = person

            personnel_list.append(person)

        if head_candidate is None and len(personnel_list) > 0:
            head_candidate = personnel_list[0]

        states_list.append({
            "zoneState": zone,
            "totalCount": len(personnel_list),
            "stateHead": head_candidate,
            "districtPersonnel": personnel_list,
        })

    result_json = {
        "version": "1.0",
        "updatedAsOf": "2026-08-10",
        "totalActiveStates": len(states_list),
        "states": states_list,
    }

    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(result_json, f, indent=2)

    print(
        f"Generated {output_json} with {len(states_list)} states successfully."
    )


if __name__ == "__main__":
    build_manpower_json()
